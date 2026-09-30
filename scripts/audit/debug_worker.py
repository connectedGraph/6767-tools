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
    "--tools", "write",
    "--no-session",
    "--no-context-files",
    "-a",
    "-p", "Please use write tool to write 'TEST' to test_out.txt"
]

env = os.environ.copy()
env["HTTP_PROXY"] = PROXY_URL
env["HTTPS_PROXY"] = PROXY_URL

async def main():
    print("Launching debug worker...")
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        limit=10 * 1024 * 1024,
        env=env
    )
    
    async def read_out(stream, name):
        try:
            while True:
                line = await stream.readline()
                if not line:
                    break
                print(f"[{name}] {line.decode('utf-8', errors='replace').rstrip()}", flush=True)
        except Exception as e:
            print(f"[{name} ERROR] {e}", flush=True)

    await asyncio.gather(
        read_out(proc.stdout, "STDOUT"),
        read_out(proc.stderr, "STDERR"),
        proc.wait()
    )
    print("Process exited with code:", proc.returncode)

if __name__ == "__main__":
    asyncio.run(main())
