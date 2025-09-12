# Server Documentation for Bible Verse Lookup

## 📁 Server Files Overview

This directory contains all the server configuration and management files you need to deploy and maintain the Bible Verse Lookup application on your server.

## 🗂️ Files Included

### Core Configuration
- **`nginx-virtual-host.conf`** - nginx virtual host configuration with SSL ready
- **`systemd-service.service`** - Systemd service for auto-start on boot

### Setup Scripts  
- **`server-setup.sh`** - Complete server setup automation
- **`ssl-setup.sh`** - Let's Encrypt SSL certificate setup
- **`monitor.sh`** - Health monitoring and maintenance automation

## 🚀 Deployment Steps

### 1. Initial Server Setup
```bash
# On your server, run the setup script
curl -L https://raw.githubusercontent.com/jimbarrett/bible-verse-lookup/main/docs/server-setup.sh | bash
```

Or manually:
```bash
# Clone repository
git clone https://github.com/jimbarrett/bible-verse-lookup.git /opt/bible-verse-lookup
cd /opt/bible-verse-lookup

# Run setup script
./docs/server-setup.sh
```

### 2. Configure Domain
Update your DNS to point your domain to your server's IP address.

### 3. Set Up SSL (Optional but Recommended)
```bash
# After DNS is configured
./docs/ssl-setup.sh
```

### 4. Set Up System Service (Optional)
```bash
# Copy systemd service file
sudo cp docs/systemd-service.service /etc/systemd/system/bible-verse-lookup.service

# Enable auto-start on boot
sudo systemctl enable bible-verse-lookup.service
sudo systemctl start bible-verse-lookup.service
```

### 5. Set Up Monitoring (Optional)
```bash
# Add to crontab for automated monitoring
crontab -e

# Add these lines:
# Health check every 5 minutes
*/5 * * * * /opt/bible-verse-lookup/docs/monitor.sh

# Full maintenance daily at 2 AM
0 2 * * * /opt/bible-verse-lookup/docs/monitor.sh --auto-update --backup
```

## 🔧 Configuration Details

### nginx Virtual Host
- **Location:** `/etc/nginx/sites-available/bible-verse-lookup`
- **Port:** Proxies to localhost:3001 (Docker container)
- **Features:** Gzip, security headers, caching, SSL ready

### Docker Configuration
- **Container Port:** 3000 (internal)
- **Host Port:** 3001 (nginx proxies to this)
- **Data Persistence:** Database mounted as volume

### SSL Certificate
- **Provider:** Let's Encrypt (free)
- **Auto-renewal:** Configured via systemd timer
- **Security:** Modern TLS configuration

## 📊 Monitoring & Maintenance

### Manual Commands
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Restart application
docker-compose restart

# Update application
git pull origin main && ./deploy.sh

# Check nginx status
sudo systemctl status nginx

# Test nginx config
sudo nginx -t
```

### Automated Monitoring
The `monitor.sh` script provides:
- Container health checks
- Automatic restarts if needed
- Disk space monitoring
- Memory usage monitoring  
- Automatic updates (optional)
- Database backups (optional)

### Log Locations
- **Application:** `docker-compose logs`
- **nginx:** `/var/log/nginx/bible-verse-lookup.*.log`
- **Monitoring:** `/var/log/bible-verse-lookup-monitor.log`
- **System:** `journalctl -u bible-verse-lookup.service`

## 🛡️ Security Features

### Application Security
- Non-root container user
- Minimal container surface
- No exposed database ports
- Security headers via nginx

### nginx Security
- XSS protection headers
- Content type sniffing prevention
- Frame options protection
- Content security policy
- SSL/TLS configuration

### System Security
- Firewall configuration (ufw)
- Fail2ban integration ready
- Log monitoring capabilities
- Regular security updates via monitoring script

## 🔄 Update Process

### Manual Updates
```bash
cd /opt/bible-verse-lookup
git pull origin main
./deploy.sh
```

### Automated Updates
Enable in monitoring script:
```bash
./docs/monitor.sh --auto-update
```

## 📈 Performance Optimization

### nginx Optimizations
- Gzip compression enabled
- Static file caching
- Proxy buffering
- Keep-alive connections

### Docker Optimizations  
- Multi-stage build for smaller images
- Standalone Next.js build
- Resource limits configurable
- Health checks included

## 🆘 Troubleshooting

### Container Issues
```bash
# Check container logs
docker-compose logs bible-app

# Rebuild if needed
docker-compose build --no-cache

# Check resource usage
docker stats
```

### nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Issues
```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Force renewal if needed
sudo certbot renew --force-renewal
```

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Check Docker and nginx documentation
4. Create an issue in the repository

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
