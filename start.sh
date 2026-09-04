#!/usr/bin/env bash
# 6767 开源站 - 在线工具集 独立启动脚本

set -e

PORT="${1:-${PORT:-8093}}"

echo "======================================================="
echo "       6767 开源站 - 在线工具集 本地部署服务"
echo "       官方站点: https://TOOL.6767.chat"
echo "======================================================="
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[错误] 未检测到 Node.js 环境！"
    echo "本项目无需额外安装 npm 依赖，但需要 Node.js (推荐 18.x 或更高版本) 运行服务。"
    echo "请访问官网安装: https://nodejs.org/"
    exit 1
fi

echo "[信息] 正在启动 6767 在线工具集服务 (端口: ${PORT})..."
echo "[信息] 访问地址: http://localhost:${PORT}/"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    (sleep 1 && open "http://localhost:${PORT}/") &
elif command -v xdg-open >/dev/null 2>&1; then
    (sleep 1 && xdg-open "http://localhost:${PORT}/") &
fi

exec node server.js "$PORT"
