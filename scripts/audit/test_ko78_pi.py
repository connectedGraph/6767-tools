import os
import subprocess
import sys
from pathlib import Path

PI_CLI_PATH = os.environ.get(
    "PI_CLI_PATH",
    str(Path.home() / "AppData" / "Roaming" / "npm" / "node_modules" / "@earendil-works" / "pi-coding-agent" / "dist" / "cli.js"),
)
PROXY_URL = os.environ.get("PI_PROXY_URL", "http://127.0.0.1:7890")

cmd = [
    "node",
    PI_CLI_PATH,
    "--model", "ko78/gpt-5.6-luna",
    "--tools", "read",
    "--no-session",
    "--no-context-files",
    "-p", "Please use the read tool to check pages/sokoban.html"
]

env = os.environ.copy()
env["HTTP_PROXY"] = PROXY_URL
env["HTTPS_PROXY"] = PROXY_URL
res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
print("RETURN CODE:", res.returncode)
print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
