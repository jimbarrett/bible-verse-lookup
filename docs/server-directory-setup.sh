#!/bin/bash

# Server Directory Setup Script for Bible Reader Online
# Sets up the Laravel-style directory structure you're familiar with

echo "🚀 Setting up Bible Reader server directories..."

# Configuration
DEPLOY_BASE="/home/deploy/apps"
APP_DIR="$DEPLOY_BASE/biblereader"
REPO_URL="https://github.com/jimbarrett/bible-verse-lookup.git"

# Create base deployment directory
echo "📁 Creating deployment directories..."
sudo mkdir -p $DEPLOY_BASE
sudo chown -R $USER:$USER $DEPLOY_BASE

# Create application directory
mkdir -p $APP_DIR/{logs,data}
echo "📁 Created: $APP_DIR"

# Clone repository temporarily to get template files
echo "📥 Fetching configuration templates..."
TEMP_DIR=$(mktemp -d)
git clone $REPO_URL $TEMP_DIR

# Copy environment template
cp $TEMP_DIR/.env.template $APP_DIR/.env

# Copy initial docker-compose file
cp $TEMP_DIR/docker-compose.yml $APP_DIR/

# Copy database if it exists in the repo
if [ -f "$TEMP_DIR/dbs/bible-sqlite.db" ]; then
    cp $TEMP_DIR/dbs/bible-sqlite.db $APP_DIR/dbs/
    echo "📚 Database file copied"
fi

# Cleanup
rm -rf $TEMP_DIR

# Set proper permissions
chmod -R 755 $APP_DIR
chmod 600 $APP_DIR/.env

echo ""
echo "✅ Directory setup complete!"
echo ""
echo "📁 Application directory: $APP_DIR"
echo ""
echo "🔧 Next steps:"
echo "1. Edit $APP_DIR/.env with your production settings"
echo "2. Set up GitHub secrets for deployment:"
echo "   - SERVER_HOST: Your server IP/hostname"
echo "   - SERVER_USER: SSH username (usually 'deploy' or your username)"
echo "   - SERVER_SSH_KEY: Your private SSH key content (NOT the .pub file)"
echo "   - SERVER_PORT: SSH port (22 if default)"
echo "3. Update nginx configuration"
echo "4. Run your first deployment from GitHub Actions"
echo ""
echo "📋 Directory structure created:"
echo "$DEPLOY_BASE/"
echo "└── biblereader/"
echo "    ├── .env                # Environment variables"
echo "    ├── docker-compose.yml  # Docker configuration"
echo "    ├── logs/               # Application logs (mounted to container)"
echo "    └── data/               # Database files (mounted to container)"
