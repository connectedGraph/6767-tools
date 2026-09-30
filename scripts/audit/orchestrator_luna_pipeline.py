import os
import sys
import json
import time
import glob
import asyncio
import psutil
import subprocess
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PI_CLI_PATH = os.environ.get(
    "PI_CLI_PATH",
    str(Path.home() / "AppData" / "Roaming" / "npm" / "node_modules" / "@earendil-works" / "pi-coding-agent" / "dist" / "cli.js"),
)
PROXY_URL = os.environ.get("PI_PROXY_URL", "http://127.0.0.1:7890")
BASE_URL = os.environ.get("AUDIT_BASE_URL", "http://127.0.0.1:8093")
STATE_FILE = "scripts/audit/pipeline_state.json"
REPORT_FILE = "scripts/audit/pipeline_report.json"
SCREENSHOT_DIR = "screenshots/luna_pipeline"
LOG_FILE = "scripts/audit/pipeline_progress.log"

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass

EXCLUDED_PAGES = {"Account", "Feedback", "Search"}

# Pre-completed 0-defect pages from previous extended audit
PRE_COMPLETED = {
    "sokoban", "2048", "minesweeper", "sudoku",
    "pixel-art-maker", "bitwise-visualizer", "json-formatter",
    "regex-tester", "base64-encoder-decoder", "contrast-checker",
    "css-glassmorphism", "ascii-art-generator"
}

REFERENCE_TEMPLATE_EXAMPLE = """
/* 样例参考规范 (参考 sokoban / pixel-art-maker 设计风格): */
/* 1. 顶部控制栏/仪表盘 (双模质感与高反差): */
.tool-dashboard {
    border-radius: 12px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    transition: all 0.2s ease;
}
html.dark .tool-dashboard {
    background: #090e1f;
    border: 1px solid #1e293b;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
}
html:not(.dark) .tool-dashboard {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}

/* 2. 按钮与交互控件 (保证触控区域 >= 36px, 双模色彩对比度严禁白底白字): */
.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    min-height: 38px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}
.action-btn-primary {
    background: #0284c7;
    border: 1px solid #0284c7;
    color: #ffffff;
}
.action-btn-primary:hover {
    background: #0369a1;
}
html.dark .action-btn-primary {
    background: rgba(14, 116, 144, 0.35);
    border: 1px solid #38bdf8;
    color: #e0f2fe;
}
html.dark .action-btn-primary:hover {
    background: #0284c7;
    color: #ffffff;
}
"""

GAME_PAGE_LESSONS = """
【HARD-WON LESSONS FROM REAL REGRESSIONS (read carefully - these actually happened)】:

CASE 1 - digital-huarong-road (tile puzzle): The refactor dropped `position: absolute`
on `.grid-number` tiles. The tiles' inline styles set left/top/width in px, but without
position:absolute they stacked vertically in one column and floated over the navbar.
It also dropped the tile background-image and board `background-size`, leaving a black
void. RULE: if the original game positions pieces with inline left/top or JS-computed
px coordinates, the elements MUST keep `position: absolute` (or be converted to a CSS
grid/flex layout AND the JS coordinates removed). NEVER leave inline coordinate styles
on statically-positioned elements. Game background images must specify
`background-size` (e.g. `100% 100%` or `center/contain`).

CASE 2 - number-sequence-memory: A Vue click handler called `mainNavVueObj.soundOpen`.
`mainNavVueObj` is only defined when `.main-nav` exists in the page - on tool pages it
does NOT exist, so the very first click threw "Cannot read properties of undefined"
and the game froze forever. The Playwright console-error check catches page LOAD
errors, but this crashed only after INTERACTION. RULE: preserve every JS call exactly
as-is (Rule 5), and if the original code references a global that could be undefined,
guard it (e.g. `typeof x !== 'undefined' && x`) instead of deleting the feature.

CASE 3 - find-different-word: the redesigned board rendered 718px tall on a 900px
desktop viewport - the full game grid did not fit on screen without scrolling.
The original board fit entirely in view. RULE: a game board (grid of tiles, puzzle
area) must fit within the first viewport at 1280x800 alongside its status bar.
Constrain with `max-width` + `aspect-ratio`, NOT full-bleed width. If the original
board was small and self-contained, keep it that way.

CASE 4 - generic Vue/Vue3 migration trap: pages mount with
`Vue.createApp(...).mount(".main-body")`. Any helper mounted on `.main-nav` or other
missing selectors returns `undefined`. Never introduce new references to
`mainNavVueObj`; if the original page already references it, keep the reference but
wrap the access in a guard so one missing global cannot freeze the whole game.
"""

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"tools": {}, "history": []}

def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def build_worker_prompt(slug, file_path, iteration=1, feedback=None):
    prompt = f"""You are Luna, an elite frontend UI/UX architect and accessibility engineer.
Task: Overhaul and modernize the UI/UX of the tool page `{file_path}`.

【EXECUTION INSTRUCTIONS】:
1. FIRST, invoke the `read` tool with `path="{file_path}"` to examine the full original source code, layout, styles, and Vue scripts.
2. NEXT, modernize and redesign the page according to the strict architectural constraints below.
3. FINALLY, invoke the `write` tool with `path="{file_path}"` to write the FULL, COMPLETE modernized HTML back to the file.
Do NOT just explain what to do in text—you MUST execute the `read` and `write` tools!

【STRICT ARCHITECTURAL CONSTRAINTS】:
1. Outer Page Hierarchy Invariant:
   All 6767-tools follow this outer layout. You MUST preserve the outermost wrapper:
   <main class="main-body tool-page-body" id="app">
       <div class="tool-body">
           <div class="card-model">
               <div class="card-body">
                   <div class="tool-head"><h1 class="title">...</h1></div>
                   <div class="description">...</div>
                   <!-- ALL YOUR MODERNIZED UI GOES HERE INSIDE .card-body -->
               </div>
           </div>
       </div>
   </main>
   Do NOT delete, rename or disrupt the `main-body tool-page-body`, `card-model`, `card-body`, `tool-head`, or `description` tags!

2. Visual Style & Theme Compatibility (Dark & Light Mode):
   - Modern, sleek, high-tech, human-ergonomic interface.
   - FULL DUAL-MODE SUPPORT: Always define styles for BOTH `html.dark` and `html:not(.dark)`!
   - NO LOW CONTRAST / WHITE-ON-WHITE BUGS:
     In light mode, backgrounds like #ffffff or #f8fafc must have dark text (#0f172a, #1e293b, #334155).
     In dark mode, backgrounds like #0b1120 or #0f172a must have bright text (#e2e8f0, #f8fafc, #94a3b8).
     Never use un-scoped `.text-white` on generic containers.
   - Clean rounded corners (border-radius: 10px-14px), subtle border lines (#1e293b in dark, #e2e8f0 in light), smooth transitions.

3. UX & Ergonomics:
   - Clear visual hierarchy with intuitive layout.
   - Touch targets for buttons/inputs must be >= 36px in height.
   - Clean status badges, crisp digital readouts or result boxes.
   - All interactive controls should have distinct hover and active states.

4. Mobile Responsive (375x812 Viewport):
   - NO horizontal overflow on mobile screens: `document.documentElement.scrollWidth <= document.documentElement.clientWidth`.
   - Never set rigid fixed widths (like `width: 600px;` or `min-width: 500px;`). Use `width: 100%; max-width: ...;` and flexbox/grid wrapping.
   - Responsive media queries (`@media (max-width: 768px)` or Tailwind responsive classes).

5. Preserve Logic (CRITICAL - a game that LOOKS pretty but CANNOT PLAY is a total failure):
   - Keep all Vue.js bindings, reactive variables, methods, calculations, and algorithms 100% functional.
   - Preserve EVERY original event handler wiring (`v-on:click`, `@input`, etc.) and every method body.
   - Do NOT rename or remove any data property, method, or global function the template references.
   - Absolutely 0 JavaScript console errors or runtime exceptions - including errors that
     only fire after user INTERACTION (clicks), not just on page load.
   - If the page renders game pieces with inline styles (left/top/width computed by JS),
     your CSS MUST keep the CSS `position` property those styles depend on (usually `absolute`).
   - Game boards must remain fully playable: pieces visible inside the board container,
     nothing overlapping the navbar, board fits the viewport.
   - After redesigning, mentally simulate one full user interaction (click start -> play
     one round) and verify no undefined-variable or null-reference errors can occur.

6. Reference Style:
{REFERENCE_TEMPLATE_EXAMPLE}

7. Regression Lessons from Real Failures:
{GAME_PAGE_LESSONS}
"""
    if feedback:
        prompt += f"""
【FEEDBACK FROM AUTOMATED AUDITOR ON PREVIOUS ATTEMPT (Iteration {iteration - 1})】:
Please fix the following specific defects in `{file_path}`:
{feedback}
"""
    prompt += f"""
IMPORTANT:
- All modernized CSS must be inside `<style>` within `{file_path}` using scoped classes and dual-mode rules (`html.dark .your-class` and `html:not(.dark) .your-class`).
- Read `{file_path}` first with `read` tool, then rewrite and save it using `write` tool!
"""
    return prompt

async def audit_with_playwright(browser, slug):
    url = f"{BASE_URL}/{slug}"
    errors = []
    
    # 1. Desktop check (1440x900)
    d_page = await browser.new_page(viewport={"width": 1440, "height": 900})
    d_page.on("pageerror", lambda e: errors.append(str(e)))
    
    try:
        await d_page.goto(url, wait_until="networkidle", timeout=12000)
    except Exception as e:
        await d_page.close()
        return {"slug": slug, "errors": [f"Navigation error: {str(e)}"], "contrast_issues": [], "mobile_overflow": False}
        
    await d_page.wait_for_timeout(400)
    os.makedirs(SCREENSHOT_DIR, exist_ok=True)
    await d_page.screenshot(path=f"{SCREENSHOT_DIR}/{slug}_desktop_dark.png")
    
    # Switch to light mode
    await d_page.evaluate("""() => {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        window.dispatchEvent(new Event('resize'));
    }""")
    await d_page.wait_for_timeout(300)
    await d_page.screenshot(path=f"{SCREENSHOT_DIR}/{slug}_desktop_light.png")
    
    # Check contrast in light mode
    contrast_issues = await d_page.evaluate("""() => {
        function parseColor(c) {
            if (!c) return [255, 255, 255, 1];
            const m = c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
            if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4] !== undefined ? parseFloat(m[4]) : 1];
            return [255, 255, 255, 1];
        }
        function lum(r, g, b) {
            const a = [r, g, b].map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }
        function ratio(rgb1, rgb2) {
            const l1 = lum(rgb1[0], rgb1[1], rgb1[2]);
            const l2 = lum(rgb2[0], rgb2[1], rgb2[2]);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }
        function getBg(el) {
            let cur = el;
            while (cur && cur !== document) {
                const s = window.getComputedStyle(cur);
                const b = parseColor(s.backgroundColor);
                if (b[3] > 0.05) return b;
                cur = cur.parentElement;
            }
            return [255, 255, 255, 1];
        }
        const bad = [];
        for (const el of document.querySelectorAll('*')) {
            if (el.children.length > 0) continue;
            const txt = (el.textContent || '').trim();
            if (!txt || txt === '/' || txt.length < 2) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) continue;
            const s = window.getComputedStyle(el);
            const fg = parseColor(s.color);
            const bg = getBg(el);
            const r = ratio(fg, bg);
            if (r < 2.5) {
                bad.push({
                    text: txt.slice(0, 25).replace(/[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]/g, ''),
                    tag: el.tagName,
                    ratio: r.toFixed(2),
                    fg: s.color,
                    bg: `rgb(${bg[0]},${bg[1]},${bg[2]})`
                });
            }
        }
        return bad;
    }""")
    await d_page.close()
    
    # 2. Mobile check (375x812)
    m_page = await browser.new_page(viewport={"width": 375, "height": 812})
    m_page.on("pageerror", lambda e: errors.append(str(e)))
    try:
        await m_page.goto(url, wait_until="networkidle", timeout=12000)
    except Exception as e:
        await m_page.close()
        return {"slug": slug, "errors": errors + [f"Mobile nav error: {str(e)}"], "contrast_issues": contrast_issues, "mobile_overflow": False}
        
    await m_page.wait_for_timeout(300)
    await m_page.screenshot(path=f"{SCREENSHOT_DIR}/{slug}_mobile_dark.png")
    
    mobile_overflow = await m_page.evaluate("""() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    }""")
    await m_page.close()
    
    return {
        "slug": slug,
        "errors": errors,
        "contrast_issues": contrast_issues,
        "mobile_overflow": mobile_overflow
    }

async def run_luna_worker_process(slug, file_path, iteration=1, feedback=None):
    prompt = build_worker_prompt(slug, file_path, iteration, feedback)
    
    cmd = [
        "node",
        PI_CLI_PATH,
        "--model", "agy/gemini-3.8-flash-high",
        "--tools", "read,write",
        "--no-session",
        "--no-context-files",
        "-a",
        "-p",
        prompt
    ]
    
    env = os.environ.copy()
    env["HTTP_PROXY"] = PROXY_URL
    env["HTTPS_PROXY"] = PROXY_URL
    env["PI_CODEX_TRANSPORT"] = "sse"
    
    try:
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=asyncio.subprocess.DEVNULL,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            limit=10 * 1024 * 1024,
            env=env
        )
        stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=300)
        return {
            "exit_code": process.returncode,
            "stdout": stdout.decode("utf-8", errors="replace") if stdout else "",
            "stderr": stderr.decode("utf-8", errors="replace") if stderr else ""
        }
    except asyncio.TimeoutError:
        try:
            process.kill()
        except Exception:
            pass
        return {
            "exit_code": -1,
            "stdout": "",
            "stderr": "Worker timeout after 300s"
        }
    except Exception as e:
        return {
            "exit_code": -1,
            "stdout": "",
            "stderr": f"Subprocess creation error: {str(e)}"
        }

async def worker_loop(queue, browser, worker_id, state, lock):
    # Stagger worker startup to avoid concurrent API request spikes
    if worker_id > 1:
        stagger_sec = (worker_id - 1) * 8
        log(f"[Worker-{worker_id}] Staggering start by {stagger_sec}s...")
        await asyncio.sleep(stagger_sec)

    while not queue.empty():
        # Memory safety throttle: keep available RAM > 6GB
        mem = psutil.virtual_memory()
        if mem.available < 6 * (1024**3):
            log(f"[Worker-{worker_id}] High memory usage ({round(mem.available / (1024**3), 2)}GB free). Throttling 5s...")
            await asyncio.sleep(5)
            continue
            
        try:
            slug = queue.get_nowait()
        except asyncio.QueueEmpty:
            break
            
        file_path = f"pages/{slug}.html"
        if not os.path.exists(file_path):
            queue.task_done()
            continue
            
        async with lock:
            state["tools"][slug] = {
                "status": "in_progress",
                "worker_id": worker_id,
                "started_at": datetime.now().isoformat()
            }
            save_state(state)
            
        log(f"[Worker-{worker_id}] >>> Starting overhaul: {slug}")
        
        passed = False
        iteration = 1
        feedback = None
        max_iterations = 2
        
        while iteration <= max_iterations and not passed:
            t0 = time.time()
            worker_res = await run_luna_worker_process(slug, file_path, iteration, feedback)
            elapsed = round(time.time() - t0, 1)
            
            # Check git diff
            diff_proc = subprocess.run(
                ["git", "diff", "--stat", file_path],
                capture_output=True, text=True
            )
            has_diff = len(diff_proc.stdout.strip()) > 0
            
            # Run Playwright audit
            audit_res = await audit_with_playwright(browser, slug)
            
            errors = audit_res.get("errors", [])
            contrast_bad = audit_res.get("contrast_issues", [])
            mobile_overflow = audit_res.get("mobile_overflow", False)
            
            is_good = (len(errors) == 0) and (not mobile_overflow) and (len(contrast_bad) <= 2) and has_diff
            
            if is_good:
                passed = True
                log(f"[Worker-{worker_id}] [PASS] {slug} passed on iteration {iteration} ({elapsed}s, diff: {has_diff})")
                
                # Commit change
                subprocess.run(["git", "add", file_path], capture_output=True)
                subprocess.run(
                    ["git", "commit", "-m", f"refactor({slug}): modernize UI/UX and fix responsive/contrast layout"],
                    capture_output=True
                )
                
                async with lock:
                    state["tools"][slug] = {
                        "status": "passed",
                        "iteration": iteration,
                        "elapsed_seconds": elapsed,
                        "errors": errors,
                        "contrast_issues_count": len(contrast_bad),
                        "mobile_overflow": mobile_overflow,
                        "completed_at": datetime.now().isoformat()
                    }
                    save_state(state)
            if not has_diff or errors or mobile_overflow or len(contrast_bad) > 2:
                log(f"[Worker-{worker_id}] {slug} iter {iteration} finish (exit={worker_res['exit_code']}, diff={has_diff}, stdout_len={len(worker_res['stdout'])})")
                if worker_res['stderr']:
                    log(f"[Worker-{worker_id}] {slug} stderr: {worker_res['stderr'][:300]}")
                if not has_diff and worker_res['stdout']:
                    log(f"[Worker-{worker_id}] {slug} stdout sample: {worker_res['stdout'][:200].strip()}")
                feedback_lines = []
                if errors:
                    feedback_lines.append(f"- Page JS console errors: {errors[:2]}")
                if mobile_overflow:
                    feedback_lines.append("- Mobile 375px viewport has horizontal overflow (scrollWidth > clientWidth). Ensure containers use max-width: 100% and flex-wrap.")
                if len(contrast_bad) > 2:
                    feedback_lines.append(f"- {len(contrast_bad)} low-contrast elements found in light mode. Samples: {contrast_bad[:3]}")
                if not has_diff:
                    feedback_lines.append("- No file changes were detected. You must actually modify pages/" + slug + ".html with modern UI improvements.")
                    
                feedback = "\n".join(feedback_lines)
                log(f"[Worker-{worker_id}] [RETRY] {slug} iteration {iteration} failed:\n{feedback}")
                iteration += 1
                
        if not passed:
            log(f"[Worker-{worker_id}] [FAIL] {slug} exhausted iterations.")
            async with lock:
                state["tools"][slug] = {
                    "status": "failed",
                    "iterations": iteration - 1,
                    "completed_at": datetime.now().isoformat()
                }
                save_state(state)
                
        queue.task_done()

import argparse

async def main():
    parser = argparse.ArgumentParser(description="6767-Tools Luna Multi-Worker Orchestrator")
    parser.add_argument("--concurrency", "-c", type=int, default=12, help="Number of concurrent workers (default: 12)")
    parser.add_argument("--tool", "-t", type=str, default=None, help="Process a specific tool slug only")
    parser.add_argument("--limit", "-l", type=int, default=None, help="Limit number of tools to process")
    args = parser.parse_args()

    concurrency = args.concurrency
    all_html = [os.path.basename(f)[:-5] for f in glob.glob("pages/*.html")]
    
    if args.tool:
        target_tools = [args.tool]
    else:
        target_tools = [
            t for t in all_html
            if t not in EXCLUDED_PAGES and t not in PRE_COMPLETED
        ]
        target_tools.sort()
    
    state = load_state()
    # Mark pre-completed tools
    for p in PRE_COMPLETED:
        if p not in state["tools"]:
            state["tools"][p] = {"status": "passed", "pre_completed": True}
    save_state(state)
    
    # Filter pending tools
    if args.tool:
        pending_tools = target_tools
    else:
        pending_tools = [
            t for t in target_tools
            if state["tools"].get(t, {}).get("status") != "passed"
        ]
    
    if args.limit and args.limit > 0:
        pending_tools = pending_tools[:args.limit]
    
    log(f"=========================================================")
    log(f"6767-TOOLS LUNA MULTI-WORKER ORCHESTRATION PIPELINE")
    log(f"Total Tool Pages: {len(all_html)}")
    log(f"Pre-completed / Passed: {len([t for t in state['tools'].values() if t.get('status') == 'passed'])}")
    log(f"Pending to Process: {len(pending_tools)}")
    log(f"Worker Concurrency: {concurrency}")
    log(f"System Available RAM: {round(psutil.virtual_memory().available / (1024**3), 2)} GB")
    log(f"=========================================================\n")
    
    if not pending_tools:
        log("No pending tools to process!")
        return

    queue = asyncio.Queue()
    for t in pending_tools:
        queue.put_nowait(t)
        
    lock = asyncio.Lock()
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        num_workers = min(concurrency, len(pending_tools))
        workers = [
            asyncio.create_task(worker_loop(queue, browser, i + 1, state, lock))
            for i in range(num_workers)
        ]
        
        await queue.join()
        for w in workers:
            w.cancel()
            
        await browser.close()
        
    print("\nALL TOOLS PROCESSED IN THIS RUN!")

if __name__ == "__main__":
    asyncio.run(main())
