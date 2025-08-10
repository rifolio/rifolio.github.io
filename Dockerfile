# Multi-stage Dockerfile for Vite React static site

# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm via corepack (respects packageManager in package.json)
RUN corepack enable

# Copy dependency files and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy project and build
COPY . .
RUN pnpm build

# 2) Run stage with nginx
FROM nginx:1.27-alpine AS runner

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

