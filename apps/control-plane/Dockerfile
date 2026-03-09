FROM node:22-bookworm-slim

WORKDIR /app
COPY . .
RUN corepack enable
CMD ["bash", "-lc", "pnpm install && pnpm --filter @pocket-cto/control-plane dev"]
