# Build stage for frontend
FROM node:18-alpine as frontend-build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the frontend app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy backend code
COPY server/ ./server/

# Copy built frontend to serve as static files
COPY --from=frontend-build /app/dist ./dist

# Create photos directory
RUN mkdir -p /app/photos

# Copy nginx configuration and install nginx
RUN apk add --no-cache nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'nginx &' >> start.sh && \
    echo 'cd server && node index.js' >> start.sh && \
    chmod +x start.sh

# Expose ports
EXPOSE 80 3001

# Start both nginx and backend
CMD ["./start.sh"]