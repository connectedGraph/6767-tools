import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const BLOCKED_NETWORK_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "curl", pattern: /\bcurl(?:\.exe)?\b/i },
  { name: "wget", pattern: /\bwget(?:\.exe)?\b/i },
  { name: "Invoke-WebRequest (iwr)", pattern: /\b(?:Invoke-WebRequest|iwr)\b/i },
  { name: "Invoke-RestMethod (irm)", pattern: /\b(?:Invoke-RestMethod|irm)\b/i },
  { name: "http/https-fetch", pattern: /\b(?:httpie|fetch|axios)\b/i },
  { name: "ssh", pattern: /\bssh(?:\.exe)?\b/i },
  { name: "scp", pattern: /\bscp(?:\.exe)?\b/i },
  { name: "sftp", pattern: /\bsftp(?:\.exe)?\b/i },
  { name: "rsync", pattern: /\brsync(?:\.exe)?\b/i },
  { name: "ftp/telnet", pattern: /\b(?:ftp|telnet)\b/i },
  { name: "netcat (nc/ncat)", pattern: /\b(?:nc|ncat|netcat)(?:\.exe)?\b/i },
  { name: "dev-tcp-socket", pattern: /\/dev\/(?:tcp|udp)\//i },
  { name: "ping", pattern: /\bping(?:\.exe)?\b/i },
  { name: "traceroute", pattern: /\b(?:traceroute|tracert)(?:\.exe)?\b/i },
  { name: "nslookup/dig", pattern: /\b(?:nslookup|dig|host)\b/i },
  { name: "nmap", pattern: /\bnmap(?:\.exe)?\b/i },
  { name: "git-network (clone/pull/push/fetch)", pattern: /\bgit(?:\.exe)?\s+(?:clone|pull|push|fetch|remote\s+add)\b/i },
  { name: "npm-network", pattern: /\bnpm(?:\.cmd|\.exe)?\s+(?:i|install|update|add|publish|audit)\b/i },
  { name: "yarn-network", pattern: /\byarn(?:\.cmd|\.exe)?\s+(?:add|install|publish)\b/i },
  { name: "pnpm-network", pattern: /\bpnpm(?:\.cmd|\.exe)?\s+(?:add|install|i|update)\b/i },
  { name: "pip-network", pattern: /\bpip3?(?:\.exe)?\s+(?:install|download)\b/i },
  { name: "cargo-network", pattern: /\bcargo(?:\.exe)?\s+(?:install|update)\b/i },
  { name: "go-network", pattern: /\bgo(?:\.exe)?\s+(?:get|install)\b/i },
  { name: "sys-pkg-network", pattern: /\b(?:apt|apt-get|yum|apk|brew)\s+(?:install|update|upgrade)\b/i }
];

export default function (pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.notify("[网络安全防御策略生效] 6767-tools 纯离线环境: 已禁用外部网络通信命令", "info");
  });

  pi.on("tool_call", async (event, ctx) => {
    if (event.toolName === "bash") {
      const command = (event.input as { command?: string })?.command || "";

      for (const item of BLOCKED_NETWORK_PATTERNS) {
        if (item.pattern.test(command)) {
          const reason = `[安全策略拦截] 该工作区为 6767-tools 纯离线自包含开发环境，已严格封禁网络通信相关命令: '${item.name}'。\n触发命令: \`${command.trim()}\`\n处理规则: 严禁联网，请仅使用本地已有环境与离线内置库完成开发。`;
          
          if (ctx.ui?.notify) {
            ctx.ui.notify(`已拦截网络指令: ${item.name}`, "error");
          }
          
          return {
            block: true,
            reason,
            terminate: false
          };
        }
      }
    }
  });
}
