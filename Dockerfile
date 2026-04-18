# syntax=docker/dockerfile:1

# ---- Builder: installs deps, compiles native modules, builds Next ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# Native module toolchain (better-sqlite3).
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---- Runner: minimal image that serves the app ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# SQLite file lives on the persistent Fly volume mounted at /data.
ENV LEDGER_DB_PATH=/data/ledger.db
ENV PORT=3000
RUN mkdir -p /data

# Copy the built app + dependencies + scripts. Scripts run via tsx for
# scheduled machines (ingest + edition), so tsx must stay in node_modules.
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]
