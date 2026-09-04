@echo off
setlocal
chcp 65001 >nul
title 6767 开源站 - 在线工具集

echo =======================================================
echo          6767 开源站 - 在线工具集 本地部署服务
echo          官方站点: https://TOOL.6767.chat
echo =======================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js 环境！
    echo 本项目无需安装 npm 依赖，但需要 Node.js (推荐 18.x 或更高版本) 运行运行时。
    echo 请访问官网下载安装: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

set PORT=8093
if not "%~1"=="" (
    set PORT=%~1
)

echo [信息] 正在启动 6767 在线工具集服务 (端口: %PORT%)...
echo [信息] 访问地址: http://localhost:%PORT%/
echo.

start "" "http://localhost:%PORT%/"
node server.js %PORT%

pause
