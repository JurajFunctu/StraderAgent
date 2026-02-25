FROM node:20-slim

WORKDIR /app

# Install root deps (server)
COPY package*.json ./
RUN npm install

# Install client deps
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy all source
COPY . .

# Build client (vite only, no tsc)
RUN cd client && npx vite build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["npx", "tsx", "server/index.ts"]
