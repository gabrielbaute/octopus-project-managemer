# ==========================================
# 1. ETAPA DE DEPENDENCIAS (BUILD DE SQLite)
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Habilitar pnpm nativo mediante corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

# Instalación de dependencias respetando los scripts de compilación de better-sqlite3
RUN pnpm install --frozen-lockfile

# ==========================================
# 2. ETAPA DE COMPILACIÓN (BUILD NEXT.JS)
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm build

# ==========================================
# 3. ETAPA FINAL DE EJECUCIÓN (RUNNER)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Valores por defecto para el contenedor (pueden sobreescribirse al ejecutar el contenedor)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs

# Exponemos el puerto parametrizado
EXPOSE ${PORT}

CMD ["node", "server.js"]
