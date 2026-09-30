import asyncio
import os
import sys
import json
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PI_CLI_PATH = os.environ.get(
    "PI_CLI_PATH",
    str(Path.home() / "AppData" / "Roaming" / "npm" / "node_modules" / "@earendil-works" / "pi-coding-agent" / "dist" / "cli.js"),
)
PROXY_URL = os.environ.get("PI_PROXY_URL", "http://127.0.0.1:7890")

from orchestrator_luna_pipeline import build_worker_prompt

async def test():
    prompt = build_worker_prompt("click-speed-test", "pages/click-speed-test.html")
    prompt += "\nIMPORTANT: Focus ONLY on `pages/click-speed-test.html`. Do NOT read or inspect global stylesheets like `css/tool-dark.css` or `css/6767-site.css`. All your modernized styles must be written directly inside `<style>` within `pages/click-speed-test.html` using scoped classes and dual-mode rules (`html.dark .your-class` and `html:not(.dark) .your-class`). Now read `pages/click-speed-test.html` and use edit or write to modernize it."
    
    cmd = [
        "node",
        PI_CLI_PATH,
        "--mode", "json",
        "--model", "openai-codex/gpt-5.6-luna",
        "--thinking", "max",
        "--tools", "read,edit,write",
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

    print("Spawning pi process with full prompt...")
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdin=asyncio.subprocess.DEVNULL,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        limit=10 * 1024 * 1024,
        env=env
    )
    
    update_count = 0
    async def read_stream(stream, prefix):
        nonlocal update_count
        while True:
            line = await stream.readline()
            if not line:
                break
            raw = line.decode("utf-8", errors="replace").rstrip()
            try:
                data = json.loads(raw)
                evt_type = data.get("type")
                if evt_type == "message_update":
                    update_count += 1
                    evt = data.get("assistantMessageEvent", {})
                    t = evt.get("type")
                    if update_count % 50 == 0 or t in ["toolcall_start", "toolcall_end"]:
                        delta = str(evt.get("delta", ""))[:40]
                        print(f"[{prefix}] UPDATE #{update_count} type={t} delta={repr(delta)}", flush=True)
                elif evt_type == "tool_execution_start":
                    print(f"[{prefix}] TOOL_START: {data.get('toolName')} args={data.get('args')}", flush=True)
                elif evt_type == "tool_execution_end":
                    print(f"[{prefix}] TOOL_END: {data.get('toolName')} isError={data.get('isError')}", flush=True)
                elif evt_type == "message_start":
                    print(f"[{prefix}] MSG_START role={data.get('message', {}).get('role')}", flush=True)
                elif evt_type == "message_end":
                    msg = data.get("message", {})
                    tools = [c.get("name") for c in msg.get("content", []) if c.get("type") == "toolCall"]
                    print(f"[{prefix}] MSG_END stopReason={msg.get('stopReason')} tools={tools}", flush=True)
                else:
                    print(f"[{prefix}] EVENT: {evt_type}", flush=True)
            except Exception:
                if raw.strip():
                    print(f"[{prefix} RAW] {raw}", flush=True)

    try:
        await asyncio.wait_for(
            asyncio.gather(
                read_stream(proc.stdout, "OUT"),
                read_stream(proc.stderr, "ERR"),
                proc.wait()
            ),
            timeout=360
        )
        print("Exit code:", proc.returncode)
    except asyncio.TimeoutError:
        print("TIMEOUT after 360s")
        proc.kill()

if __name__ == "__main__":
    asyncio.run(test())
