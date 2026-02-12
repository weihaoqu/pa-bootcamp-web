# Stage 1: Build the static site
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and content
COPY . .

# Build static export (skip prebuild sync — content is committed)
RUN npx next build

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/out /srv

EXPOSE 80 443
