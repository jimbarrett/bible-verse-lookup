#!/bin/bash

# Monitoring and Maintenance Script for Bible Verse Lookup
# Run this periodically to check app health and perform maintenance

APP_DIR="/opt/bible-verse-lookup"
LOG_FILE="/var/log/bible-verse-lookup-monitor.log"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | sudo tee -a $LOG_FILE
}

# Check if container is running
check_container_health() {
    log_message "Checking container health..."
    
    cd $APP_DIR
    if docker-compose ps | grep -q "Up"; then
        log_message "✅ Container is running"
        
        # Test HTTP response
        if curl -sf http://localhost:3001 > /dev/null; then
            log_message "✅ Application responding to HTTP requests"
        else
            log_message "❌ Application not responding to HTTP requests"
            log_message "🔄 Restarting containers..."
            docker-compose restart
        fi
    else
        log_message "❌ Container is not running"
        log_message "🚀 Starting containers..."
        docker-compose up -d
    fi
}

# Check disk space
check_disk_space() {
    DISK_USAGE=$(df / | awk 'NR==2{printf "%.0f", $5}')
    log_message "📊 Disk usage: ${DISK_USAGE}%"
    
    if [ $DISK_USAGE -gt 85 ]; then
        log_message "⚠️  High disk usage detected!"
        log_message "🧹 Cleaning up Docker images..."
        docker system prune -f
    fi
}

# Check memory usage
check_memory_usage() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    log_message "📊 Memory usage: ${MEMORY_USAGE}%"
    
    if [ $MEMORY_USAGE -gt 90 ]; then
        log_message "⚠️  High memory usage detected!"
    fi
}

# Update application (if auto-update is enabled)
update_application() {
    if [ "$1" == "--auto-update" ]; then
        log_message "🔄 Checking for updates..."
        cd $APP_DIR
        
        git fetch origin main
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse origin/main)
        
        if [ $LOCAL != $REMOTE ]; then
            log_message "📥 Updates available, deploying..."
            git pull origin main
            ./deploy.sh
            log_message "✅ Update deployed successfully"
        else
            log_message "✅ Application is up to date"
        fi
    fi
}

# Backup database
backup_database() {
    if [ "$1" == "--backup" ]; then
        BACKUP_DIR="/opt/backups/bible-verse-lookup"
        DATE=$(date +%Y%m%d_%H%M%S)
        
        sudo mkdir -p $BACKUP_DIR
        sudo cp $APP_DIR/dbs/bible-sqlite.db $BACKUP_DIR/bible-sqlite_$DATE.db
        
        log_message "💾 Database backup created: bible-sqlite_$DATE.db"
        
        # Keep only last 7 backups
        sudo find $BACKUP_DIR -name "bible-sqlite_*.db" -type f -mtime +7 -delete
    fi
}

# Main monitoring function
main() {
    log_message "🔍 Starting health check..."
    
    check_container_health
    check_disk_space
    check_memory_usage
    update_application $1
    backup_database $1
    
    log_message "✅ Health check complete"
    echo ""
}

# Show usage if no arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --auto-update    Check for and apply updates"
    echo "  --backup         Create database backup"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Basic health check"
    echo "  $0 --auto-update --backup  # Full maintenance"
    echo ""
    echo "Add to crontab for automated monitoring:"
    echo "  # Every 5 minutes - health check"
    echo "  */5 * * * * /opt/bible-verse-lookup/docs/monitor.sh"
    echo ""
    echo "  # Daily at 2 AM - full maintenance"
    echo "  0 2 * * * /opt/bible-verse-lookup/docs/monitor.sh --auto-update --backup"
    exit 0
fi

# Run main function
main $*
