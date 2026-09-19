#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Concurrent Agentic Loop Refactoring & Verifier Engine
-----------------------------------------------------
1. 极简 Prompt & 4 大核心基础工具 (read, edit, write, bash) + mark_complete 验收标记。
2. 严格命令拦截沙箱：禁止任何外部网络请求 (curl/wget/git/npm/ssh/pip等) 与危险系统操作。
3. Runtime 强闭环验收系统 (The Verifier Loop):
   - 第一道防线：Git Diff 检查，杜绝无意义假完成。
   - 第二道防线：Playwright 真机多视口渲染检测 (375x812 移动端 + 1440x900 桌面端)。
   - 精准提取超宽溢出 DOM 节点 (tagName, id, class, overflow_px) 与控制台报错，反馈给模型继续修改。
   - 验收完全绿灯则归档高清修复截图并标记 SUCCESS。
   - 单文件设定 60 轮上限熔断，超时打上 FLAG_MAX_TURNS_EXCEEDED 并记录。
4. 并发推进：采用 asyncio 调度多个 Worker 并行向前推进，不搞完不停止。
"""

import os
import sys
import json
import time
import re
import asyncio
import subprocess
import urllib.request
import ssl
from typing import List, Dict, Any, Optional

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

from playwright.async_api import async_playwright

BASE_DIR = r"C:\Users\18086\.workspace\git-workspace\6767-tools"
SCREENSHOT_DIR = os.path.join(BASE_DIR, "audit_screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

API_ENDPOINT = "https://api.example.invalid/v1/chat/completions"
API_KEY = "[REDACTED_API_KEY]"
MODEL_NAME = "gpt-5.6-luna"
PROXY_URL = "http://127.0.0.1:7890"

MAX_TURNS_PER_FILE = 60
CONCURRENCY = 3

# ---------- 风险命令拦截列表 ----------
FORBIDDEN_COMMAND_PATTERNS = [
    r"\bcurl\b", r"\bwget\b", r"\bgit\s+(clone|pull|push|fetch|remote)\b",
    r"\bnpm\s+(i|install|publish|update)\b", r"\bpip\s+(install|download)\b",
    r"\bssh\b", r"\bscp\b", r"\bsftp\b", r"\btelnet\b", r"\bnc\b", r"\bncat\b",
    r"Invoke-WebRequest", r"\biwr\b", r"Invoke-RestMethod", r"\birm\b",
    r"http://", r"https://",
    r"rm\s+-rf\s+/", r"del\s+/s", r"format\s+[a-z]:", r"shutdown", r"reboot"
]

# ---------- 4 大核心工具 + 1 验收工具定义 ----------
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "读取项目内指定相对路径的文件内容。支持指定 start_line 和 end_line 进行区间读取。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "相对项目根目录的文件路径，例如 pages/periodic-table.html"},
                    "start_line": {"type": "integer", "description": "起始行号（从 1 开始，可选）"},
                    "end_line": {"type": "integer", "description": "结束行号（可选）"}
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_file",
            "description": "精准替换文件中的特定代码段。target 必须在文件中唯一存在。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "相对项目根目录的文件路径"},
                    "target": {"type": "string", "description": "被替换的原始代码片段（必须精确匹配）"},
                    "replacement": {"type": "string", "description": "替换后的新代码片段"}
                },
                "required": ["path", "target", "replacement"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "全量覆写指定文件的内容。仅在需全量重构或创建新辅助文件时使用。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "相对项目根目录的文件路径"},
                    "content": {"type": "string", "description": "要写入的完整文件内容"}
                },
                "required": ["path", "content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "bash",
            "description": "在项目目录中执行无害本地 Shell/CLI 检查命令（网络请求与危险命令已被安全沙箱拦截封禁）。",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "要执行的本地命令行，例如 node -c pages/xxx.html 或 echo test"}
                },
                "required": ["command"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "mark_complete",
            "description": "声明当前文件重构已完毕。调用此工具将触发 Runtime 执行真实 Git Diff 与 Playwright 移动端/桌面端真机验收。",
            "parameters": {
                "type": "object",
                "properties": {
                    "summary": {"type": "string", "description": "重构简述（说明修复了哪些布局问题与适配细节）"}
                },
                "required": ["summary"]
            }
        }
    }
]

# ---------- 工具底层执行逻辑 ----------
def execute_read_file(path: str, start_line: Optional[int] = None, end_line: Optional[int] = None) -> str:
    full_path = os.path.join(BASE_DIR, path)
    if not os.path.exists(full_path):
        return f"Error: 文件不存在: {path}"
    try:
        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()
        total = len(lines)
        s = max(1, start_line) if start_line else 1
        e = min(total, end_line) if end_line else min(total, s + 300)
        selected = lines[s - 1:e]
        numbered = [f"{s + idx}: {line}" for idx, line in enumerate(selected)]
        header = f"[文件: {path} | 总行数: {total} | 当前展示: {s}~{e} 行]\n"
        return header + "".join(numbered)
    except Exception as ex:
        return f"Error reading file: {str(ex)}"

def execute_edit_file(path: str, target: str, replacement: str) -> str:
    full_path = os.path.join(BASE_DIR, path)
    if not os.path.exists(full_path):
        return f"Error: 文件不存在: {path}"
    try:
        with open(full_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
        occurrences = content.count(target)
        if occurrences == 0:
            return f"Error: target 内容在 {path} 中未找到，请核对代码前后行确保精确匹配。"
        if occurrences > 1:
            return f"Error: target 内容在 {path} 中出现 {occurrences} 次，不唯一，请提供包含更多上下文的片段。"
        new_content = content.replace(target, replacement, 1)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        return f"Success: 成功替换 {path} 中的代码块。"
    except Exception as ex:
        return f"Error editing file: {str(ex)}"

def execute_write_file(path: str, content: str) -> str:
    full_path = os.path.join(BASE_DIR, path)
    try:
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Success: 成功写入文件 {path} ({len(content)} 字符)。"
    except Exception as ex:
        return f"Error writing file: {str(ex)}"

def execute_bash(command: str) -> str:
    # 风险命令拦截
    for pat in FORBIDDEN_COMMAND_PATTERNS:
        if re.search(pat, command, re.IGNORECASE):
            return f"[SECURITY_BLOCKED] 命令被安全沙箱拦截！检测到外部网络请求或危险操作模式: '{pat}'。纯离线开发环境中禁止该操作。"
    try:
        res = subprocess.run(
            command,
            shell=True,
            cwd=BASE_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=20,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        out = res.stdout.strip()
        err = res.stderr.strip()
        result = []
        if out:
            result.append(f"[STDOUT]\n{out[:2000]}")
        if err:
            result.append(f"[STDERR]\n{err[:2000]}")
        if not result:
            result.append("[Command exited with code 0 and no output]")
        return "\n".join(result)
    except subprocess.TimeoutExpired:
        return "Error: 命令执行超时 (20s)"
    except Exception as ex:
        return f"Error executing bash: {str(ex)}"

# ---------- 网络请求封装 (走 7890 代理并带 Tool Call) ----------
def call_model_api(messages: List[Dict[str, Any]]) -> Dict[str, Any]:
    proxy_handler = urllib.request.ProxyHandler({'http': PROXY_URL, 'https': PROXY_URL})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    opener = urllib.request.build_opener(proxy_handler, urllib.request.HTTPSHandler(context=ctx))

    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': MODEL_NAME,
        'messages': messages,
        'tools': TOOLS_SCHEMA,
        'tool_choice': 'auto',
        'temperature': 0.2
    }
    data_bytes = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(API_ENDPOINT, data=data_bytes, headers=headers)
    
    # 最多重试 3 次
    for attempt in range(3):
        t0 = time.perf_counter()
        try:
            with opener.open(req, timeout=90) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                elapsed = round(time.perf_counter() - t0, 2)
                # print(f"  [API 响应成功 | 耗时: {elapsed}s]", flush=True)
                return res['choices'][0]['message']
        except Exception as e:
            elapsed = round(time.perf_counter() - t0, 2)
            print(f"  [API 异常第 {attempt+1} 次 | 耗时: {elapsed}s | 错误: {e}]", flush=True)
            if attempt == 2:
                raise e
            time.sleep(2)
    raise RuntimeError("Model API call failed after retries")

# ---------- Runtime 真实 Playwright & Git 验收系统 ----------
async def verify_page_compliance(browser, tool_code: str) -> Dict[str, Any]:
    file_rel = f"pages/{tool_code}.html"
    
    # 1. 检查 Git Diff
    diff_res = subprocess.run(
        f"git diff --name-only {file_rel}",
        shell=True,
        cwd=BASE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        encoding='utf-8',
        errors='replace'
    )
    has_diff = file_rel.replace('/', '\\') in diff_res.stdout or file_rel in diff_res.stdout
    if not has_diff:
        # 如果是新增未跟踪文件也算
        st_res = subprocess.run(f"git status --porcelain {file_rel}", shell=True, cwd=BASE_DIR, stdout=subprocess.PIPE, text=True)
        has_diff = len(st_res.stdout.strip()) > 0

    if not has_diff:
        return {
            "passed": False,
            "reason": "GIT_DIFF_EMPTY",
            "message": f"未检测到对目标文件 {file_rel} 的任何有效修改！请真正编辑该文件后再调用 mark_complete。"
        }

    # 2. Playwright 真机渲染测试 (Mobile 375x812 + Desktop 1440x900)
    url = f"http://localhost:8093/{tool_code}"
    
    mobile_ctx = await browser.new_context(
        viewport={"width": 375, "height": 812},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"
    )
    desktop_ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    
    m_page = await mobile_ctx.new_page()
    d_page = await desktop_ctx.new_page()

    console_errors = []
    m_page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
    m_page.on("pageerror", lambda err: console_errors.append(str(err)))

    try:
        m_resp = await m_page.goto(url, timeout=10000, wait_until="domcontentloaded")
        await asyncio.sleep(0.6)
        if not m_resp or m_resp.status != 200:
            return {"passed": False, "reason": "PAGE_LOAD_FAILED", "message": f"页面加载失败，HTTP 状态: {m_resp.status if m_resp else 'None'}"}

        # 检测移动端超宽横向打架溢出元素
        overflow_elements = await m_page.evaluate("""
            () => {
                const vw = window.innerWidth;
                const bad = [];
                const all = document.querySelectorAll('*');
                for (const el of all) {
                    const r = el.getBoundingClientRect();
                    if (r.right > vw + 3) {
                        bad.push({
                            tag: el.tagName.toLowerCase(),
                            id: el.id || null,
                            className: (typeof el.className === 'string' ? el.className : '').trim().slice(0, 50),
                            width: Math.round(r.width),
                            overflow_px: Math.round(r.right - vw)
                        });
                    }
                }
                bad.sort((a, b) => b.overflow_px - a.overflow_px);
                return bad.slice(0, 5);
            }
        """)

        # 截图留存
        m_shot = os.path.join(SCREENSHOT_DIR, f"{tool_code}_fixed_mobile.png")
        await m_page.screenshot(path=m_shot, full_page=False)

        # 桌面端验证与截图
        await d_page.goto(url, timeout=10000, wait_until="domcontentloaded")
        await asyncio.sleep(0.4)
        d_shot = os.path.join(SCREENSHOT_DIR, f"{tool_code}_fixed_desktop.png")
        await d_page.screenshot(path=d_shot, full_page=False)

        if len(overflow_elements) > 0:
            offenders_desc = []
            for item in overflow_elements:
                cls_info = f" class='{item['className']}'" if item['className'] else ""
                id_info = f" id='{item['id']}'" if item['id'] else ""
                offenders_desc.append(f"- <{item['tag']}{id_info}{cls_info}>: 宽度 {item['width']}px, 溢出视口 {item['overflow_px']}px")
            
            return {
                "passed": False,
                "reason": "MOBILE_OVERFLOW",
                "message": (
                    f"验收未通过！移动端 (375px 宽度) 存在以下超界横向打架元素：\n"
                    + "\n".join(offenders_desc)
                    + "\n请调整这些元素在移动端下的 CSS（例如使用 @media(max-width:768px)，设置 max-width: 100%, overflow-x: auto, flex-wrap: wrap, 或减小 padding/grid 尺寸），确保无横向滚动条。"
                )
            }

        if len(console_errors) > 0:
            return {
                "passed": False,
                "reason": "CONSOLE_ERROR",
                "message": f"验收未通过！页面运行时产生控制台 JS 报错 ({len(console_errors)} 条): {console_errors[0][:150]}"
            }

        # 验收完全通过！
        return {
            "passed": True,
            "reason": "PASS",
            "message": "验收 100% 通过！移动端 (375px) 零溢出横向打架，控制台 0 报错，文件修改有效并已生成最新对照截图。"
        }

    finally:
        await mobile_ctx.close()
        await desktop_ctx.close()

# ---------- 单个文件的 Agent 闭环 Worker ----------
async def run_tool_refactor_worker(tool_code: str, browser, worker_id: int) -> Dict[str, Any]:
    file_rel = f"pages/{tool_code}.html"
    print(f"\n[Worker #{worker_id}] 启动处理任务: {tool_code} (目标: {file_rel})")

    system_prompt = (
        "你是一名精通现代 Web 前端设计与响应式重构的资深工程师。\n"
        f"当前任务：重构并修复页面 `{file_rel}` 在手机移动端（375px 视口）下的布局打架、元素横向溢出问题，提升其现代设计美感。\n"
        "要求：\n"
        "1. 原生纯离线：严禁引入外部 CDN 链接或网络请求，所有逻辑在本地自包含。\n"
        "2. 响应式适配：确保在 375px 手机端及任意缩放下无横向滚动条、元素不挤压打架；必要时在移动端媒体查询下使用横向滑动容器 (overflow-x: auto) 或折叠自适应流排版。\n"
        "3. 功能完整：严格保留原有的全部交互功能与算法，不得破坏现有功能。\n"
        "4. 操作规范：使用 read_file 查看代码，使用 edit_file 或 write_file 实施重构。修改满意后调用 mark_complete 提交 Runtime 验收。"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"请开始重构 `{file_rel}`。首先使用 read_file 检查该页面的布局与样式，定位移动端溢出原因并修复。"}
    ]

    turn = 0
    final_status = "IN_PROGRESS"
    final_reason = ""

    while turn < MAX_TURNS_PER_FILE:
        turn += 1
        print(f"[Worker #{worker_id} | {tool_code}] 第 {turn}/{MAX_TURNS_PER_FILE} 轮模型迭代中...", flush=True)

        try:
            # 异步执行 HTTP 请求，避免阻塞事件循环
            assistant_msg = await asyncio.to_thread(call_model_api, messages)
        except Exception as e:
            print(f"[Worker #{worker_id} | {tool_code}] API 报错: {e}，将在 3 秒后重试...")
            await asyncio.sleep(3)
            continue

        messages.append(assistant_msg)
        tool_calls = assistant_msg.get("tool_calls", [])

        if not tool_calls:
            # 模型没有调工具，自然回复
            content = assistant_msg.get("content", "")
            print(f"[Worker #{worker_id} | {tool_code}] 模型纯文本输出: {content[:100]}...")
            # 提示模型使用工具
            messages.append({
                "role": "user",
                "content": "请使用 edit_file/write_file 实施代码修改，修好后请调用 mark_complete 工具提交验收。"
            })
            continue

        # 执行工具调用
        completed_signal = False
        for tc in tool_calls:
            func_name = tc["function"]["name"]
            try:
                args = json.loads(tc["function"]["arguments"])
            except Exception:
                args = {}

            call_id = tc["id"]
            tool_res_str = ""

            args_summary = ", ".join(f"{k}='{str(v)[:30]}...'" if len(str(v)) > 30 else f"{k}={v}" for k, v in args.items())
            print(f"[Worker #{worker_id} | {tool_code}] -> 执行工具: {func_name}({args_summary})", flush=True)

            if func_name == "read_file":
                tool_res_str = execute_read_file(
                    args.get("path", file_rel),
                    args.get("start_line"),
                    args.get("end_line")
                )
            elif func_name == "edit_file":
                tool_res_str = execute_edit_file(
                    args.get("path", file_rel),
                    args.get("target", ""),
                    args.get("replacement", "")
                )
            elif func_name == "write_file":
                tool_res_str = execute_write_file(
                    args.get("path", file_rel),
                    args.get("content", "")
                )
            elif func_name == "bash":
                tool_res_str = execute_bash(args.get("command", ""))
            elif func_name == "mark_complete":
                completed_signal = True
                summary = args.get("summary", "Done")
                print(f"[Worker #{worker_id} | {tool_code}] 模型提出验收申请: {summary}")
                
                # Runtime 真实介入验收
                print(f"[Worker #{worker_id} | {tool_code}] >>> Runtime 启动 Playwright 与 Git 真机验收...")
                audit_res = await verify_page_compliance(browser, tool_code)
                if audit_res["passed"]:
                    print(f"✅ [Worker #{worker_id} | {tool_code}] 验收合格！PASS！")
                    tool_res_str = audit_res["message"]
                    final_status = "SUCCESS"
                    final_reason = summary
                else:
                    print(f"❌ [Worker #{worker_id} | {tool_code}] 验收被驳回: {audit_res['reason']}")
                    tool_res_str = audit_res["message"]
            else:
                tool_res_str = f"Unknown tool: {func_name}"

            messages.append({
                "role": "tool",
                "tool_call_id": call_id,
                "content": tool_res_str
            })

        if final_status == "SUCCESS":
            break

    if final_status != "SUCCESS":
        final_status = "FAILED_MAX_TURNS"
        final_reason = f"达到最大轮次 {MAX_TURNS_PER_FILE} 仍未通过验收"
        print(f"⚠️ [Worker #{worker_id} | {tool_code}] 达到熔断上限，打上标记: {final_status}")

    return {
        "tool_code": tool_code,
        "status": final_status,
        "turns": turn,
        "reason": final_reason
    }

# ---------- 并发调度主入口 ----------
async def main():
    import socket
    def is_port_in_use(port: int) -> bool:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('127.0.0.1', port)) == 0

    # 支持命令行指定页面
    if len(sys.argv) > 1:
        target_tools = sys.argv[1:]
    else:
        # 默认首批 10 款存在移动端横向溢出打架的重点工具
        target_tools = [
            "uuid-generator",           # UUID 生成器 (已定位 .uuid-item-copy 溢出 52px)
            "text-autospace",           # 中英文排版
            "periodic-table",           # 元素周期表
            "table-converter",          # 表格转换器
            "css-gradient-generator",   # 渐变色生成器
            "css-shadow-generator",     # 阴影生成器
            "color-palette-extractor",  # 调色板提取器
            "image-stitcher",           # 长图拼接
            "image-mosaic-blur",        # 马赛克局部模糊
            "resume-template"           # 简历模板中心
        ]

    print("=" * 70)
    print(f"【并发重构与真实验收 Loop 启动】")
    print(f"待处理重点队列 ({len(target_tools)} 款): {target_tools}")
    print(f"并发 Worker 数: {CONCURRENCY} | 单任务轮次上限: {MAX_TURNS_PER_FILE}")
    print("=" * 70)

    server_proc = None
    if not is_port_in_use(8093):
        print("正在启动本地静态测试服务 http://localhost:8093 ...")
        server_proc = subprocess.Popen(["node", "server.js", "8093"], cwd=BASE_DIR, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        await asyncio.sleep(2)
    else:
        print("本地服务 http://localhost:8093 已在运行中，直接复用。")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        sem = asyncio.Semaphore(CONCURRENCY)

        async def worker_wrapper(code: str, idx: int):
            async with sem:
                return await run_tool_refactor_worker(code, browser, idx + 1)

        tasks = [worker_wrapper(code, i) for i, code in enumerate(target_tools)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        await browser.close()

    if server_proc:
        try:
            server_proc.terminate()
        except Exception:
            pass

    # 打印最终成果大表
    print("\n" + "=" * 70)
    print("【全部并发重构任务执行完毕统计表】")
    print("=" * 70)
    success_count = 0
    for res in results:
        if isinstance(res, dict):
            status_icon = "✅ SUCCESS" if res["status"] == "SUCCESS" else f"❌ {res['status']}"
            if res["status"] == "SUCCESS":
                success_count += 1
            print(f"工具: /{res['tool_code']:<25} | 状态: {status_icon:<15} | 轮次: {res['turns']:<3} | 简述: {res['reason'][:30]}")
        else:
            print(f"异常任务: {res}")
    print(f"\n总计: {len(target_tools)} 款 | 成功重构并通过验收: {success_count} 款 | 需人工复核/超限: {len(target_tools) - success_count} 款")

if __name__ == "__main__":
    asyncio.run(main())
