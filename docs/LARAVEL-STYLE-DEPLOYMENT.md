# Laravel-Style Deployment Guide

## 🏗️ **Deployment Architecture**

This setup follows your existing Laravel deployment pattern with some Next.js-specific adaptations.

### **Directory Structure (Matches Your Laravel Apps)**

```
/home/deploy/apps/
├── barrett-dev/              # Your existing Laravel app
├── barrett-prod/             # Your existing Laravel app  
└── biblereader/              # New Next.js app
    ├── .env                  # Server-side environment (NOT in repo)
    ├── docker-compose.yml    # Copied from repo during deploy
    ├── logs/                 # Mounted to container for persistence
    └── data/                 # Database files (mounted to container)
```

### **Port Allocation**
- **Bible Reader:** Port 3001 (biblereader.online)
- **Your existing apps:** Keep their current ports

### **nginx Configuration**
Add this virtual host alongside your existing Laravel configs:

```nginx
# /etc/nginx/sites-available/biblereader
server {
    listen 80;
    server_name biblereader.online www.biblereader.online;
    
    location / {
        proxy_pass http://localhost:3001;  # Points to Docker container
        # ... (standard proxy headers)
    }
}
```

## 🚀 **Deployment Process**

### **Key Differences from Laravel:**
1. **GitHub Actions** handles deployment (not manual scripts)
2. **Docker image building** happens on server (like Laravel)
3. **Environment files** stay on server (same as Laravel)
4. **Container naming** follows your pattern: `biblereader`

### **Workflow:**
1. **Push to main** → Triggers GitHub Action
2. **GitHub Action** → SSH to server
3. **Server** → Pulls latest code, builds image, restarts container
4. **Manual Deploy** → Available from GitHub UI

### **Environment Variables:**

**Current (SQLite only):**
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
DOMAIN=biblereader.online
```

**Future (when adding external DB):**
```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/biblereader
# OR
MYSQL_HOST=localhost
MYSQL_PORT=3306  
MYSQL_DATABASE=biblereader
MYSQL_USER=biblereader_user
MYSQL_PASSWORD=secure_password

# API Keys
EXTERNAL_API_KEY=your_key_here

# Logging
LOG_LEVEL=info
LOG_FILE=/app/logs/application.log
```

## 🔧 **Setup Steps**

### **1. Server Directory Setup**
```bash
# On your server, run:
curl -L https://raw.githubusercontent.com/jimbarrett/bible-verse-lookup/main/docs/server-directory-setup.sh | bash
```

### **2. GitHub Secrets Setup**
Add these secrets in GitHub repository settings:
- `SERVER_HOST`: Your server IP/hostname
- `SERVER_USER`: SSH username (`deploy` or your username)
- `SERVER_SSH_KEY`: Your private SSH key content
- `SERVER_PORT`: SSH port (22 if default)

### **3. nginx Configuration**
```bash
# Copy the nginx config
sudo cp /home/deploy/app/biblereader-online-prod/docs/nginx-virtual-host.conf /etc/nginx/sites-available/biblereader-online

# Enable the site
sudo ln -s /etc/nginx/sites-available/biblereader-online /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

### **4. Environment Configuration**
```bash
# Edit production environment
nano /home/deploy/app/biblereader-online-prod/.env

# Edit development environment  
nano /home/deploy/app/biblereader-online-dev/.env
```

### **5. Initial Deployment**
- Go to GitHub repository → Actions tab
- Click "Deploy Bible Reader Online"
- Click "Run workflow" 
- Select "prod" environment
- Click "Run workflow"

## 🔄 **How Deployments Work**

### **Automatic Deployments:**
```
Push to main → GitHub Action → SSH to server → Build & Deploy
```

### **Manual Deployments:**
```  
GitHub UI → Select environment → Deploy → SSH to server → Build & Deploy
```

### **Deployment Steps (Automated):**
1. Clone latest code to temp directory
2. Copy `docker-compose.{env}.yml` to deployment directory
3. Build new Docker image with commit SHA tag
4. Stop existing container
5. Start new container with new image
6. Clean up old images (keeps last 3)

## 📊 **Monitoring & Logs**

### **Container Status:**
```bash
# Check status
cd /home/deploy/apps/biblereader
docker-compose ps
```

### **Application Logs:**
```bash
# Application logs
docker-compose logs -f

# Persistent logs (when implemented)
tail -f /home/deploy/apps/biblereader/logs/application.log
```

### **nginx Logs:**
```bash
tail -f /var/log/nginx/biblereader.access.log
tail -f /var/log/nginx/biblereader.error.log
```

## 🔮 **Future Database Integration**

When you're ready to add external database:

### **1. Update Environment Variables:**
```env
# In /home/deploy/apps/biblereader/.env
DATABASE_URL=postgresql://user:password@localhost:5432/biblereader

# Or for MySQL
MYSQL_HOST=localhost
MYSQL_DATABASE=biblereader
MYSQL_USER=biblereader_user
MYSQL_PASSWORD=secure_password
```

### **2. Update Next.js Code:**
- Add database connection logic
- Update API routes to use external DB
- Add migration scripts if needed

### **3. No Infrastructure Changes Needed:**
- Docker setup already supports environment variables
- nginx configuration doesn't change
- Deployment process stays the same

## 🔒 **Security Considerations**

### **Environment Variables:**
- ✅ Stored on server (not in repo)
- ✅ Separate prod/dev environments
- ✅ .env files have restricted permissions (600)

### **Container Security:**
- ✅ Non-root user in container
- ✅ Named containers for easy management
- ✅ Network isolation per environment
- ✅ Health checks enabled

### **GitHub Actions Security:**
- ✅ SSH key stored as encrypted secret
- ✅ No sensitive data in workflow files
- ✅ Manual deployment approval available

This setup gives you the same deployment pattern as your Laravel apps but adapted for Next.js with GitHub Actions automation!
