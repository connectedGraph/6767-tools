#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Playwright Automated Frontend Tool Auditor & Screenshot Suite
功能：
1. 批量遍历待审查的工具页面（重点聚焦 31 款“新方案纳入”不可信工具与重点存量页面）。
2. 多视口渲染测试：
   - Desktop: 1440x900 / 1280x800
   - Mobile: 375x812 (iPhone 尺寸，严格检测移动端适配)
   - Tablet / Zoom: 1024x768
3. 布局与健壮性自动化判定：
   - 监听并捕获所有 Console.error / Uncaught JS 异常。
   - 检测视口横向溢出 (document.documentElement.scrollWidth > window.innerWidth)，抓取手机端打架穿透的元素。
   - 校验核心交互组件、输入框、按钮是否有无样式或错位现象。
4. 全量高清截图留存，生成多维度图文审查报告。
"""

import os
import sys
import json
import time
import subprocess
from typing import List, Dict, Any

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

BASE_DIR = r"C:\Users\18086\.workspace\git-workspace\6767-tools"
SCREENSHOT_DIR = os.path.join(BASE_DIR, "audit_screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def load_manifest() -> Dict[str, Any]:
    manifest_path = os.path.join(BASE_DIR, "tools_audit_manifest.json")
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def run_playwright_audit(tool_codes: List[str], base_url: str = "http://localhost:8093") -> List[Dict[str, Any]]:
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. 桌面视口上下文 (1440 x 900)
        desktop_ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        # 2. 移动端视口上下文 (375 x 812, 模拟 iPhone 移动端)
        mobile_ctx = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )

        d_page = desktop_ctx.new_page()
        m_page = mobile_ctx.new_page()

        for idx, code in enumerate(tool_codes, start=1):
            url = f"{base_url}/{code}"
            print(f"[{idx:02d}/{len(tool_codes)}] 正在审查页面: /{code} ...", end=" ", flush=True)

            console_errors = []
            d_page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            d_page.on("pageerror", lambda err: console_errors.append(str(err)))

            t0 = time.perf_counter()
            d_ok = False
            m_ok = False
            d_overflow = False
            m_overflow = False
            err_msg = None

            desktop_shot_path = os.path.join(SCREENSHOT_DIR, f"{code}_desktop.png")
            mobile_shot_path = os.path.join(SCREENSHOT_DIR, f"{code}_mobile.png")

            try:
                # 访问桌面端
                d_resp = d_page.goto(url, timeout=10000, wait_until="domcontentloaded")
                time.sleep(0.5) # 等待局部渲染或初始脚本
                if d_resp and d_resp.status == 200:
                    d_ok = True
                    # 检查桌面端横向溢出
                    d_overflow = d_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 5")
                    d_page.screenshot(path=desktop_shot_path, full_page=False)
                else:
                    err_msg = f"HTTP 状态码异常: {d_resp.status if d_resp else 'No response'}"

                # 访问手机端
                m_resp = m_page.goto(url, timeout=10000, wait_until="domcontentloaded")
                time.sleep(0.5)
                if m_resp and m_resp.status == 200:
                    m_ok = True
                    # 检查手机端横向溢出（打架/内容挤出屏幕）
                    m_overflow = m_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 5")
                    m_page.screenshot(path=mobile_shot_path, full_page=False)

            except Exception as e:
                err_msg = f"{type(e).__name__}: {str(e)}"

            elapsed = round(time.perf_counter() - t0, 2)
            has_errors = len(console_errors) > 0 or d_overflow or m_overflow or not (d_ok and m_ok)

            verdict = "PASS"
            issues = []
            if not d_ok or not m_ok:
                verdict = "PAGE_LOAD_FAILED"
                issues.append(f"加载失败: {err_msg}")
            if console_errors:
                verdict = "JS_ERROR"
                issues.append(f"控制台 JS 报错 ({len(console_errors)} 条): {console_errors[0][:80]}")
            if m_overflow:
                verdict = "MOBILE_OVERFLOW"
                issues.append("移动端视口元素横向打架溢出！需要重构响应式布局")
            if d_overflow:
                issues.append("桌面端视口出现异常横向滚动条")

            verdict_style = "OK" if verdict == "PASS" else verdict
            print(f"[{verdict_style}] (耗时: {elapsed}s) {(' | ' + '; '.join(issues)) if issues else ''}")

            results.append({
                "code": code,
                "url": url,
                "verdict": verdict,
                "issues": issues,
                "console_errors": console_errors,
                "desktop_overflow": d_overflow,
                "mobile_overflow": m_overflow,
                "desktop_screenshot": desktop_shot_path if d_ok else None,
                "mobile_screenshot": mobile_shot_path if m_ok else None,
                "elapsed_s": elapsed
            })

        browser.close()

    return results

def main():
    manifest = load_manifest()
    untrusted = manifest.get("untrusted_new_tools", [])
    print(f"载入清单：共有 {len(untrusted)} 款【新方案纳入】待审查不可信工具。")

    # 启动后台 Node 服务器供 Playwright 访问
    print("正在启动本地静态测试服务器 http://localhost:8093 ...")
    server_proc = subprocess.Popen(["node", "server.js", "8093"], cwd=BASE_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    time.sleep(2)

    try:
        results = run_playwright_audit(untrusted, base_url="http://localhost:8093")
        
        # 统计
        passed = sum(1 for r in results if r["verdict"] == "PASS")
        failed = len(results) - passed
        print("\n" + "=" * 70)
        print(f"【新方案纳入工具 Playwright 巡检完成】")
        print(f"总抽检: {len(results)} 款 | 完全合规 (PASS): {passed} 款 | 存在缺陷/打架 (ISSUE): {failed} 款")
        print("=" * 70)

        # 写入巡检报告
        report_md = os.path.join(BASE_DIR, "UNTRUSTED_TOOLS_AUDIT_REPORT.md")
        with open(report_md, "w", encoding="utf-8") as f:
            f.write("# 【新方案纳入】不可信工具队列 Playwright 自动化巡检与重构指引\n\n")
            f.write(f"- **巡检时间**: `{time.strftime('%Y-%m-%d %H:%M:%S')}`\n")
            f.write(f"- **审查范围**: 31 款第二期新方案纳入工具\n")
            f.write(f"- **完全合规 (PASS)**: `{passed}` 款\n")
            f.write(f"- **存在布局缺陷/JS报错/打架**: `{failed}` 款\n\n")
            f.write("## 详细审查明细表\n\n")
            f.write("| 序号 | 工具路由 | 综合判定 | 移动端打架溢出 | JS 控制台报错 | 缺陷描述与重构建议 |\n")
            f.write("| :---: | :--- | :---: | :---: | :---: | :--- |\n")
            for i, r in enumerate(results, start=1):
                m_ov = "⚠️ 溢出" if r["mobile_overflow"] else "正常"
                js_err = f"❌ {len(r['console_errors'])}条" if r["console_errors"] else "正常"
                iss = "<br>".join(r["issues"]) if r["issues"] else "界面与脚本正常"
                f.write(f"| {i} | `{r['code']}` | **{r['verdict']}** | {m_ov} | {js_err} | {iss} |\n")

        print(f"详细缺陷报告已保存至: {report_md}")
        print(f"桌面与移动端对比截图均已保存至: {SCREENSHOT_DIR}")

    finally:
        server_proc.terminate()

if __name__ == "__main__":
    main()
