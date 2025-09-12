# SSL Certificate Setup with Let's Encrypt
# Run this AFTER your domain DNS is pointing to your server

# This script sets up free SSL certificates using Let's Encrypt

#!/bin/bash

echo "🔒 Setting up SSL Certificate with Let's Encrypt..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
else
    echo "✅ certbot already installed"
fi

# Prompt for domain name
read -p "Enter your domain name (e.g., bible.yourdomain.com): " DOMAIN_NAME

# Verify domain is pointing to this server
echo "🔍 Checking if domain points to this server..."
DOMAIN_IP=$(dig +short $DOMAIN_NAME | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo "⚠️  WARNING: Domain $DOMAIN_NAME ($DOMAIN_IP) does not point to this server ($SERVER_IP)"
    echo "Please update your DNS records first, then run this script again."
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get SSL certificate
echo "🔒 Obtaining SSL certificate..."
sudo certbot --nginx -d $DOMAIN_NAME

# Set up auto-renewal
echo "🔄 Setting up auto-renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
echo "🧪 Testing certificate renewal..."
sudo certbot renew --dry-run

echo ""
echo "🎉 SSL Setup Complete!"
echo "🔒 Your site should now be available at: https://$DOMAIN_NAME"
echo "🔄 Certificates will auto-renew via systemd timer"
echo ""
echo "💡 To check certificate status: sudo certbot certificates"
echo "💡 To manually renew: sudo certbot renew"
