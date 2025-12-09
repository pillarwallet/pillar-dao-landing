FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies for Bun on Alpine
RUN apk add --no-cache libc6-compat

# Install bun via npm
RUN npm install -g bun

# Install all dependencies (needed for build)
RUN npm ci

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN bun run build

# Stage 2: Production
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

# Copy necessary files from builder with correct ownership
COPY --chown=node:node --from=builder /app/.next ./.next
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Copy built app and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/data ./src/data

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "start"]
