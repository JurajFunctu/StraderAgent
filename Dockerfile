FROM node:20-slim AS base

# Install client dependencies and build
FROM base AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npx vite build

# Install server dependencies and build  
FROM base AS server-build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.server.json ./
RUN npm ci
COPY server/ ./server/
RUN npx tsc --project tsconfig.server.json || true

# Production image
FROM base AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=server-build /app/dist ./dist
COPY --from=client-build /app/client/dist ./client/dist
COPY server/seed.ts ./server/seed.ts
COPY drizzle.config.ts ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
