#!/bin/bash

# Bible Reader - Server Deployment Checklist
# Run this on your server after setting up directories

set -e

echo "🔍 Bible Reader - Server Deployment Checklist"
echo "=================================================="

# Check if we're running as the correct user
if [[ $USER != "deploy" && $USER != "barrett" ]]; then
    echo "⚠️  Warning: Running as '$USER', usually run as 'deploy' or 'barrett'"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo
echo "1. 📁 Checking directory structure..."
BASE_DIR="/home/deploy/apps"
APP_DIR="$BASE_DIR/biblereader"

if [[ -d "$APP_DIR" ]]; then
    echo "   ✅ $APP_DIR exists"
else
    echo "   ❌ $APP_DIR missing - run server-directory-setup.sh first"
    exit 1
fi

echo
echo "2. 🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo "   ✅ Docker installed: $(docker --version | head -1)"
else
    echo "   ❌ Docker not installed"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    echo "   ✅ Docker Compose installed: $(docker-compose --version)"
else
    echo "   ❌ Docker Compose not installed"
    exit 1
fi

echo
echo "3. 🌐 Checking nginx..."
if systemctl is-active --quiet nginx; then
    echo "   ✅ nginx is running"
else
    echo "   ❌ nginx is not running"
    exit 1
fi

if [[ -f "/etc/nginx/sites-available/biblereader" ]]; then
    echo "   ✅ Virtual host config exists"
else
    echo "   ⚠️  Virtual host config missing"
    echo "      Run: sudo cp $APP_DIR/docs/nginx-virtual-host.conf /etc/nginx/sites-available/biblereader"
fi

if [[ -L "/etc/nginx/sites-enabled/biblereader" ]]; then
    echo "   ✅ Virtual host enabled"
else
    echo "   ⚠️  Virtual host not enabled"
    echo "      Run: sudo ln -s /etc/nginx/sites-available/biblereader /etc/nginx/sites-enabled/"
fi

echo
echo "4. 🔐 Checking environment files..."
env_file="$APP_DIR/.env"
if [[ -f "$env_file" ]]; then
    echo "   ✅ $env_file exists"
    
    # Check permissions
    perms=$(stat -c "%a" "$env_file" 2>/dev/null || stat -f "%A" "$env_file" 2>/dev/null)
    if [[ "$perms" == "600" ]]; then
        echo "   ✅ $env_file permissions correct (600)"
    else
        echo "   ⚠️  $env_file permissions: $perms (should be 600)"
        echo "      Run: chmod 600 $env_file"
    fi
else
    echo "   ⚠️  $env_file missing"
    echo "      Copy from: $APP_DIR/.env.template"
fi

echo
echo "5. 🔑 Checking SSH access..."
if [[ -f ~/.ssh/authorized_keys ]]; then
    echo "   ✅ SSH authorized_keys exists"
    key_count=$(wc -l < ~/.ssh/authorized_keys)
    echo "   ℹ️  $key_count authorized SSH keys"
else
    echo "   ⚠️  No SSH authorized_keys file"
    echo "      GitHub Actions needs SSH access for deployment"
fi

echo
echo "6. 🔌 Checking ports..."
for port in 3001 3002; do
    if ss -ln | grep -q ":$port "; then
        echo "   ⚠️  Port $port is in use"
        service=$(ss -lntp | grep ":$port " | awk '{print $6}' | cut -d'=' -f2 | cut -d',' -f1)
        echo "      Used by: $service"
    else
        echo "   ✅ Port $port is available"
    fi
done

echo
echo "7. 🎯 Domain DNS check..."
if command -v dig &> /dev/null; then
    server_ip=$(dig +short biblereader.online A | head -1)
    if [[ -n "$server_ip" ]]; then
        echo "   ✅ biblereader.online → $server_ip"
        
        # Check if it points to this server
        local_ips=$(hostname -I 2>/dev/null || ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
        if echo "$local_ips" | grep -q "$server_ip"; then
            echo "   ✅ Domain points to this server"
        else
            echo "   ⚠️  Domain points to $server_ip, but this server is: $local_ips"
        fi
    else
        echo "   ⚠️  biblereader.online DNS not found"
    fi
else
    echo "   ⚠️  dig command not available for DNS check"
fi

echo
echo "📋 Summary:"
echo "=========="
echo "✅ = Ready"
echo "⚠️  = Needs attention"  
echo "❌ = Blocking issue"
echo
echo "🚀 Next steps:"
echo "   1. Fix any ❌ blocking issues above"
echo "   2. Address ⚠️  warnings as needed"
echo "   3. Configure GitHub secrets in repository"
echo "   4. Run your first deployment from GitHub Actions"
echo
echo "🔗 GitHub Secrets needed:"
echo "   SERVER_HOST=your.server.ip"
echo "   SERVER_USER=$USER" 
echo "   SERVER_SSH_KEY=(private key content)"
echo "   SERVER_PORT=22"
