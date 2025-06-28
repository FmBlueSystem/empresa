# Stage 1: Base image with non-root user
FROM node:18-alpine AS base

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /usr/src/app

# Development stage
FROM base AS development

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Expose port
EXPOSE 3000

# Start in development mode with nodemon
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY --chown=nodejs:nodejs . .

# Production stage
FROM base AS production

# Install security updates and dumb-init
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Set working directory
WORKDIR /usr/src/app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /usr/src/app .

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
 