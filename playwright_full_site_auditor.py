#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Playwright 全站 186 款存量工具全量自动化真机巡检套件
双视口真机评测：
1. 桌面视口: 1440 x 900
2. 移动端视口: 375 x 812 (iPhone 窄屏，严格检测元素打架与溢出)
指标收集：
- HTTP 状态与白屏
- 控制台 Console.error / Uncaught JS 异常
- 375px 横向溢出 (精确排除受限安全裁剪容器，提取真实超界元素与像素)
- 桌面端横向滚动条
- 生成全站巡检报告 FULL_SITE_TOOLS_AUDIT_REPORT.md
- 截图归档到 full_audit_screenshots/
"""

import os
import sys
import json
import time
import subprocess
import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from playwright.sync_api import sync_playwright

BASE_DIR = Path(r"C:\Users\18086\.workspace\git-workspace\6767-tools")
PAGES_DIR = BASE_DIR / "pages"
SCREENSHOT_DIR = BASE_DIR / "full_audit_screenshots"
SCREENSHOT_DIR.mkdir(exist_ok=True)

CHECK_OVERFLOW_JS = """
() => {
    const docWidth = window.innerWidth;
    const bodyScrollWidth = document.documentElement.scrollWidth;
    const elements = Array.from(document.querySelectorAll('*'));
    
    function isClippedByAncestor(el) {
        let parent = el.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
            const style = window.getComputedStyle(parent);
            const ox = style.overflowX;
            const o = style.overflow;
            if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll' ||
                o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') {
                const pRect = parent.getBoundingClientRect();
                if (pRect.right <= docWidth + 2) {
                    return true;
                }
            }
            parent = parent.parentElement;
        }
        return false;
    }

    const overflowing = [];
    for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1 && rect.width > 0) {
            if (!isClippedByAncestor(el)) {
                overflowing.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id || '',
                    className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join(' ') : '',
                    overflow_px: (rect.right - docWidth).toFixed(1),
                    width: rect.width.toFixed(1)
                });
            }
        }
    }
    return {
        hasPageScroll: bodyScrollWidth > docWidth + 3,
        overflowing: overflowing.slice(0, 5)
    };
}
"""

def get_all_page_codes():
    html_files = sorted([f.stem for f in PAGES_DIR.glob("*.html") if f.name != "index.html"])
    return html_files

def audit_worker(worker_id: int, codes_chunk: list, base_url: str) -> list:
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        desktop_ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        mobile_ctx = browser.new_context(
            viewport={"width": 375, "height": 812},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
        )
        d_page = desktop_ctx.new_page()
        m_page = mobile_ctx.new_page()

        for idx, code in enumerate(codes_chunk, start=1):
            url = f"{base_url}/{code}"
            t0 = time.perf_counter()
            console_errors = []
            
            d_page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            d_page.on("pageerror", lambda err: console_errors.append(str(err)))

            d_ok = False
            m_ok = False
            d_overflow = False
            m_overflow_items = []
            has_page_scroll = False
            err_msg = None

            d_shot = SCREENSHOT_DIR / f"{code}_desktop.png"
            m_shot = SCREENSHOT_DIR / f"{code}_mobile.png"

            try:
                # 桌面端
                d_resp = d_page.goto(url, timeout=12000, wait_until="domcontentloaded")
                time.sleep(0.3)
                if d_resp and d_resp.status == 200:
                    d_ok = True
                    d_overflow = d_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth + 5")
                    d_page.screenshot(path=str(d_shot), full_page=False)
                else:
                    err_msg = f"HTTP {d_resp.status if d_resp else 'NoResp'}"

                # 移动端
                m_resp = m_page.goto(url, timeout=12000, wait_until="domcontentloaded")
                time.sleep(0.3)
                if m_resp and m_resp.status == 200:
                    m_ok = True
                    eval_res = m_page.evaluate(CHECK_OVERFLOW_JS)
                    m_overflow_items = eval_res["overflowing"]
                    has_page_scroll = eval_res["hasPageScroll"]
                    m_page.screenshot(path=str(m_shot), full_page=False)

            except Exception as e:
                err_msg = f"{type(e).__name__}: {str(e)}"

            elapsed = round(time.perf_counter() - t0, 2)
            has_m_overflow = (len(m_overflow_items) > 0) or has_page_scroll

            verdict = "PASS"
            issues = []
            if not d_ok or not m_ok:
                verdict = "LOAD_FAILED"
                issues.append(f"加载异常: {err_msg}")
            if console_errors:
                verdict = "JS_ERROR"
                issues.append(f"JS报错 ({len(console_errors)}条): {console_errors[0][:60]}")
            if has_m_overflow:
                verdict = "MOBILE_OVERFLOW"
                if m_overflow_items:
                    first_ov = m_overflow_items[0]
                    issues.append(f"375px移动端溢出<{first_ov['tag']}.{first_ov['className']}> 超界{first_ov['overflow_px']}px")
                elif has_page_scroll:
                    issues.append("375px移动端全局横向滚动条超标")
            if d_overflow and verdict == "PASS":
                verdict = "DESKTOP_OVERFLOW"
                issues.append("桌面端横向滚动条")

            status_prefix = "[PASS]" if verdict == "PASS" else "[WARN]"
            print(f"[Worker #{worker_id} | {idx}/{len(codes_chunk)}] {status_prefix} /{code} -> {verdict} ({elapsed}s) {('; '.join(issues)) if issues else ''}", flush=True)

            results.append({
                "code": code,
                "url": url,
                "verdict": verdict,
                "issues": issues,
                "console_errors": console_errors,
                "desktop_overflow": d_overflow,
                "mobile_overflow": has_m_overflow,
                "overflow_elements": m_overflow_items,
                "elapsed_s": elapsed
            })

        browser.close()
    return results

def is_server_alive(port: int = 8093) -> bool:
    try:
        req = urllib.request.Request(f"http://127.0.0.1:{port}/pages/markdown.html", headers={"User-Agent": "AuditProbe"})
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            return resp.status == 200
    except Exception:
        return False

def main():
    all_codes = get_all_page_codes()
    total_count = len(all_codes)
    print("=" * 70)
    print("【6767-tools 全站 186 款存量工具 Playwright 真机全量大巡检启动】")
    print(f"目标页面总数: {total_count} 款 | 视口: 1440x900 (Desktop) + 375x812 (Mobile)")
    print("=" * 70)

    # 检查或启动 Node 本地服务器
    server_proc = None
    if not is_server_alive(8093):
        print("正在启动静态服务器 http://localhost:8093 ...")
        server_proc = subprocess.Popen(["node", "server.js", "8093"], cwd=str(BASE_DIR), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(2)
    else:
        print("检测到本地服务器已在 http://localhost:8093 就绪，直接复用。")

    try:
        # 使用 4 个线程并发巡检，分块处理
        num_workers = 4
        chunk_size = (total_count + num_workers - 1) // num_workers
        chunks = [all_codes[i:i + chunk_size] for i in range(0, total_count, chunk_size)]

        t_start = time.perf_counter()
        all_results = []

        with ThreadPoolExecutor(max_workers=num_workers) as executor:
            futures = [executor.submit(audit_worker, i + 1, chunks[i], "http://localhost:8093") for i in range(len(chunks))]
            for f in futures:
                all_results.extend(f.result())

        total_elapsed = round(time.perf_counter() - t_start, 2)
        
        # 统计分析
        passed = [r for r in all_results if r["verdict"] == "PASS"]
        m_overflow = [r for r in all_results if r["verdict"] == "MOBILE_OVERFLOW"]
        js_errors = [r for r in all_results if r["verdict"] == "JS_ERROR"]
        load_failed = [r for r in all_results if r["verdict"] == "LOAD_FAILED"]
        d_overflow = [r for r in all_results if r["verdict"] == "DESKTOP_OVERFLOW"]

        print("\n" + "=" * 70)
        print(f"【全站 186 款存量工具巡检完成】 (总耗时: {total_elapsed}s)")
        print(f"- 完全合规 (PASS): {len(passed)} 款 ({round(len(passed)/total_count*100, 1)}%)")
        print(f"- 移动端横向溢出打架 (MOBILE_OVERFLOW): {len(m_overflow)} 款")
        print(f"- 控制台脚本报错 (JS_ERROR): {len(js_errors)} 款")
        print(f"- 桌面端横向溢出 (DESKTOP_OVERFLOW): {len(d_overflow)} 款")
        print(f"- 页面加载异常 (LOAD_FAILED): {len(load_failed)} 款")
        print("=" * 70)

        # 整理元数据
        defect_manifest = {
            "total_audited": total_count,
            "pass_count": len(passed),
            "mobile_overflow_codes": [r["code"] for r in m_overflow],
            "js_error_codes": [r["code"] for r in js_errors],
            "load_failed_codes": [r["code"] for r in load_failed],
            "desktop_overflow_codes": [r["code"] for r in d_overflow],
            "all_results": all_results
        }
        (BASE_DIR / "full_site_audit_summary.json").write_text(json.dumps(defect_manifest, ensure_ascii=False, indent=2), encoding="utf-8")

        # 生成全量详细报告
        report_path = BASE_DIR / "FULL_SITE_TOOLS_AUDIT_REPORT.md"
        with open(report_path, "w", encoding="utf-8") as f:
            f.write("# 6767-tools 全站 186 款存量工具 Playwright 真机大巡检报告\n\n")
            f.write(f"- **巡检时间**: `{time.strftime('%Y-%m-%d %H:%M:%S')}`\n")
            f.write(f"- **全量工具总计**: `{total_count}` 款\n")
            f.write(f"- **完全合规 (PASS)**: `{len(passed)}` 款 (`{round(len(passed)/total_count*100, 1)}%`)\n")
            f.write(f"- **移动端溢出打架 (MOBILE_OVERFLOW)**: `{len(m_overflow)}` 款\n")
            f.write(f"- **控制台脚本异常 (JS_ERROR)**: `{len(js_errors)}` 款\n")
            f.write(f"- **其他异常**: `{len(load_failed) + len(d_overflow)}` 款\n\n")
            
            if m_overflow:
                f.write("## 待重构队列：移动端 375px 横向打架与溢出工具\n\n")
                f.write("| 序号 | 工具路由 | 溢出元素与像素 | 修复建议 |\n")
                f.write("| :---: | :--- | :--- | :--- |\n")
                for i, r in enumerate(m_overflow, start=1):
                    ov_str = "<br>".join([f"`<{x['tag']}.{x['className']}>` 溢出 +{x['overflow_px']}px" for x in r["overflow_elements"]])
                    f.write(f"| {i} | `pages/{r['code']}.html` | {ov_str} | 修复容器弹性换行与表格/控件 min-width |\n")
                f.write("\n")

            if js_errors:
                f.write("## 待修复队列：控制台 JS 报错工具\n\n")
                f.write("| 序号 | 工具路由 | 报错详情 |\n")
                f.write("| :---: | :--- | :--- |\n")
                for i, r in enumerate(js_errors, start=1):
                    errs = "<br>".join(r["console_errors"][:3])
                    f.write(f"| {i} | `pages/{r['code']}.html` | {errs} |\n")
                f.write("\n")

            f.write("## 全站 186 款工具完整状态汇总大表\n\n")
            f.write("| 序号 | 工具代码 | 综合判定 | 移动端 375px | 控制台状态 | 异常简述 |\n")
            f.write("| :---: | :--- | :---: | :---: | :---: | :--- |\n")
            for i, r in enumerate(sorted(all_results, key=lambda x: (0 if x['verdict']!='PASS' else 1, x['code'])), start=1):
                m_stat = "溢出" if r["mobile_overflow"] else "正常"
                c_stat = f"报错({len(r['console_errors'])}条)" if r["console_errors"] else "正常"
                iss = "<br>".join(r["issues"]) if r["issues"] else "界面与运行正常"
                v_badge = f"**{r['verdict']}**" if r["verdict"] != "PASS" else "PASS"
                f.write(f"| {i} | `{r['code']}` | {v_badge} | {m_stat} | {c_stat} | {iss} |\n")

        print(f"全站巡检汇总报告已写入: {report_path}")
        print(f"元数据已写入: {BASE_DIR / 'full_site_audit_summary.json'}")

    finally:
        if server_proc:
            server_proc.terminate()

if __name__ == "__main__":
    main()
