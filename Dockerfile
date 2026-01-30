# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies for Bun on Alpine
RUN apk add --no-cache libc6-compat

# Install bun via npm
RUN npm install -g bun

# Copy package files
COPY package.json package-lock.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Install dependencies for Bun on Alpine
RUN apk add --no-cache libc6-compat

# Install bun via npm
RUN npm install -g bun

# Change ownership of the working directory to the node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Copy package files
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/package-lock.json ./package-lock.json
COPY --chown=node:node --from=builder /app/bun.lock ./bun.lock

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Copy built app and server files
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/server ./server
COPY --chown=node:node --from=builder /app/src/data ./src/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]
