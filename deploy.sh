#!/bin/bash

# Bible Verse Lookup - Docker Deployment Script
echo "🐳 Starting Bible Verse Lookup Docker Deployment..."

# Stop existing container if running
echo "📦 Stopping existing containers..."
docker-compose down

# Remove old images to force rebuild (optional)
echo "🗑️ Removing old images..."
docker image prune -f

# Build and start the application
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Show container status
echo "📊 Container Status:"
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo "✅ Deployment complete!"
echo "🌐 App should be available at: http://localhost:3001"
echo "📝 View logs with: docker-compose logs -f"
