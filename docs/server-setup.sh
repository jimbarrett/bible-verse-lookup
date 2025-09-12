#!/bin/bash

# Server Setup Script for Bible Verse Lookup
# Run this script on your server to set up nginx and Docker

echo "🚀 Setting up Bible Verse Lookup Server..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed"
fi

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "🌐 Installing nginx..."
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
else
    echo "✅ nginx already installed"
fi

# Install git if not already installed
if ! command -v git &> /dev/null; then
    echo "📚 Installing git..."
    sudo apt install -y git
else
    echo "✅ git already installed"
fi

# Create application directory
APP_DIR="/opt/bible-verse-lookup"
echo "📁 Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone the repository
echo "📥 Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd $APP_DIR && git pull origin main
else
    git clone https://github.com/jimbarrett/bible-verse-lookup.git $APP_DIR
fi

# Set up nginx virtual host
echo "🌐 Setting up nginx virtual host..."
sudo cp $APP_DIR/docs/nginx-virtual-host.conf /etc/nginx/sites-available/bible-verse-lookup

# Prompt for domain name
read -p "Enter your domain name (e.g., bible.yourdomain.com): " DOMAIN_NAME
sudo sed -i "s/bible.yourdomain.com/$DOMAIN_NAME/g" /etc/nginx/sites-available/bible-verse-lookup

# Enable the site
sudo ln -sf /etc/nginx/sites-available/bible-verse-lookup /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ nginx configuration is valid"
    sudo systemctl reload nginx
else
    echo "❌ nginx configuration has errors. Please check the config file."
    exit 1
fi

# Set up firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔒 Configuring firewall..."
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw --force enable
fi

# Deploy the application
echo "🚀 Deploying the application..."
cd $APP_DIR && ./deploy.sh

# Show status
echo "📊 Deployment Status:"
cd $APP_DIR && docker-compose ps

echo ""
echo "🎉 Setup Complete!"
echo "📍 Application directory: $APP_DIR"
echo "🌐 Domain: http://$DOMAIN_NAME"
echo "🐳 Docker status: docker-compose ps"
echo "📋 View logs: docker-compose logs -f"
echo ""
echo "🔧 Next steps:"
echo "1. Configure your DNS to point $DOMAIN_NAME to this server"
echo "2. Optionally set up SSL with: sudo certbot --nginx -d $DOMAIN_NAME"
echo "3. Monitor logs and performance"
