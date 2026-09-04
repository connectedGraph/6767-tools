FROM node:20-alpine

LABEL maintainer="connectedGraph"
LABEL description="6767 开源站 - 在线工具集 (Standalone)"

WORKDIR /app

# 纯原生 Node.js 实现，零 npm 依赖，复制全部离线资产
COPY . .

ENV NODE_ENV=production
ENV PORT=8093
ENV DATA_DIR=/app/_server_data

VOLUME ["/app/_server_data", "/app/up/uploads"]

EXPOSE 8093

CMD ["node", "server.js"]
