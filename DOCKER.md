# Docker Deployment Guide

## 📋 Prerequisites

1. **Docker** and **Docker Compose** installed on your server
2. **Nginx** configured with virtual hosts (as you mentioned)
3. **Git** to clone/update the repository

## 🚀 Quick Deployment

### Option 1: Automated Deployment
```bash
# Make sure you're in the project directory
./deploy.sh
```

### Option 2: Manual Steps
```bash
# Stop any existing containers
docker-compose down

# Build and start
docker-compose up --build -d

# Check status
docker-compose ps
```

## 🔧 Configuration

### Port Configuration
- **Container Internal Port:** 3000
- **Host Port:** 3001 (configurable in docker-compose.yml)
- **Your Nginx:** Should proxy to `localhost:3001`

### Nginx Configuration Example
Add this to your nginx virtual host config:

```nginx
server {
    listen 80;
    server_name your-bible-app-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables
- Copy `.env.production` to `.env.production.local` if you need custom settings
- Modify `docker-compose.yml` to change the port mapping

## 📊 Management Commands

### View Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# View recent logs
docker-compose logs --tail=50
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Redeploy
./deploy.sh
```

### Stop/Start
```bash
# Stop containers
docker-compose down

# Start containers (without rebuilding)
docker-compose up -d

# Restart containers
docker-compose restart
```

### Database Management
The SQLite database is mounted as a volume, so data persists across container restarts.

**Database Location:**
- **Host:** `./dbs/bible-sqlite.db`
- **Container:** `/app/dbs/bible-sqlite.db`

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check build logs
docker-compose build --no-cache

# Check container logs
docker-compose logs bible-app
```

### Port Conflicts
If port 3001 is in use:
1. Edit `docker-compose.yml`
2. Change `"3001:3000"` to `"XXXX:3000"` (where XXXX is available port)
3. Update your nginx configuration accordingly

### Database Issues
```bash
# Check database file permissions
ls -la dbs/

# Access container shell if needed
docker-compose exec bible-app sh
```

### Performance Issues
```bash
# Check resource usage
docker stats

# Check container health
docker-compose ps
```

## 📁 File Structure
```
/your-project/
├── Dockerfile              # Main Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore           # Files to ignore in Docker build
├── deploy.sh              # Automated deployment script
├── .env.production        # Environment template
├── next.config.js         # Updated for Docker standalone mode
└── dbs/                   # SQLite database directory
    └── bible-sqlite.db    # Your database file
```

## 🔄 CI/CD Integration
For automated deployments, you can:

1. **Git Hooks:** Set up a post-receive hook to run `./deploy.sh`
2. **GitHub Actions:** Deploy on push to main branch
3. **Cron Jobs:** Schedule regular updates

## 🛡️ Security Notes
- The container runs as a non-root user (`nextjs`)
- Database files are owned by the container user
- No sensitive data is exposed in environment variables
- Consider adding SSL termination at the nginx level
