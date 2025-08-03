FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy all other files
COPY . .

# Install production dependencies only
RUN npm prune --production

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose ports
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]