import asyncio
import os
import sys
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

cmd = [
    "node",
    PI_CLI_PATH,
    "--mode", "json",
    "--model", "ko78/gpt-5.6-luna",
    "--tools", "read",
    "--no-session",
    "--no-context-files",
    "-a",
    "-p", "Use read tool to read pages/sokoban.html"
]

env = os.environ.copy()
env["HTTP_PROXY"] = PROXY_URL
env["HTTPS_PROXY"] = PROXY_URL

async def main():
    print("Launching with stdin=DEVNULL...")
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdin=asyncio.subprocess.DEVNULL,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        limit=10 * 1024 * 1024,
        env=env
    )
    
    while True:
        line = await proc.stdout.readline()
        if not line:
            break
        print("OUT:", line.decode("utf-8", errors="replace").rstrip(), flush=True)

    err = await proc.stderr.read()
    if err:
        print("ERR:", err.decode("utf-8", errors="replace"), flush=True)
    await proc.wait()
    print("Exit code:", proc.returncode)

if __name__ == "__main__":
    asyncio.run(main())
