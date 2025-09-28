#!/bin/bash

# 24/7 Car Salon Server Startup Script
# This script ensures your server runs continuously like your furniture projects
# Auto-restart, monitoring, and health checks included

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="avto-salon"
FRONTEND_PORT=3000
API_PORT=4001
BACKUP_DIR="/var/backups/avto-salon"
LOG_DIR="/var/log/avto-salon"
HEALTH_CHECK_INTERVAL=30
MAX_RESTART_ATTEMPTS=5
RESTART_DELAY=10

print_status() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    sudo mkdir -p $BACKUP_DIR
    sudo mkdir -p $LOG_DIR
    sudo chown $USER:$USER $BACKUP_DIR
    sudo chown $USER:$USER $LOG_DIR
}

# Health check function
health_check() {
    local service_name=$1
    local port=$2
    local url=$3
    
    if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
        print_status "✅ $service_name is healthy (port $port)"
        return 0
    else
        print_error "❌ $service_name is not responding (port $port)"
        return 1
    fi
}

# Restart service function
restart_service() {
    local service_name=$1
    local restart_count=$2
    
    if [ $restart_count -ge $MAX_RESTART_ATTEMPTS ]; then
        print_error "🚨 Maximum restart attempts reached for $service_name. Manual intervention required!"
        return 1
    fi
    
    print_warning "🔄 Restarting $service_name (attempt $((restart_count + 1))/$MAX_RESTART_ATTEMPTS)..."
    
    case $service_name in
        "frontend")
            if command -v pm2 &> /dev/null; then
                pm2 restart $APP_NAME-frontend || pm2 start npm --name "$APP_NAME-frontend" -- start:production
            else
                pkill -f "next start" || true
                sleep 2
                npm run start:production &
            fi
            ;;
        "nginx")
            sudo systemctl restart nginx
            ;;
        "docker")
            docker-compose -f docker-compose.production.yml restart
            ;;
    esac
    
    sleep $RESTART_DELAY
    return 0
}

# Main monitoring loop
monitor_services() {
    print_header "Starting 24/7 Monitoring"
    
    local frontend_restart_count=0
    local nginx_restart_count=0
    local docker_restart_count=0
    
    while true; do
        print_status "🔍 Performing health checks..."
        
        # Check frontend
        if ! health_check "Frontend" $FRONTEND_PORT "http://localhost:$FRONTEND_PORT"; then
            if restart_service "frontend" $frontend_restart_count; then
                frontend_restart_count=$((frontend_restart_count + 1))
            else
                frontend_restart_count=$MAX_RESTART_ATTEMPTS
            fi
        else
            frontend_restart_count=0
        fi
        
        # Check nginx
        if ! health_check "Nginx" 80 "http://localhost"; then
            if restart_service "nginx" $nginx_restart_count; then
                nginx_restart_count=$((nginx_restart_count + 1))
            else
                nginx_restart_count=$MAX_RESTART_ATTEMPTS
            fi
        else
            nginx_restart_count=0
        fi
        
        # Check if using Docker
        if [ -f "docker-compose.production.yml" ]; then
            if ! docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
                if restart_service "docker" $docker_restart_count; then
                    docker_restart_count=$((docker_restart_count + 1))
                else
                    docker_restart_count=$MAX_RESTART_ATTEMPTS
                fi
            else
                docker_restart_count=0
            fi
        fi
        
        # Log status
        echo "$(date '+%Y-%m-%d %H:%M:%S') - All services healthy" >> $LOG_DIR/health.log
        
        print_status "💤 Sleeping for $HEALTH_CHECK_INTERVAL seconds..."
        sleep $HEALTH_CHECK_INTERVAL
    done
}

# Backup function
create_backup() {
    print_status "📦 Creating backup..."
    local backup_file="$BACKUP_DIR/backup-$(date '+%Y%m%d-%H%M%S').tar.gz"
    
    tar -czf "$backup_file" \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        . 2>/dev/null || true
    
    # Keep only last 7 days of backups
    find $BACKUP_DIR -name "backup-*.tar.gz" -mtime +7 -delete 2>/dev/null || true
    
    print_status "✅ Backup created: $backup_file"
}

# Cleanup function
cleanup() {
    print_status "🧹 Cleaning up..."
    
    # Clean old logs (keep last 30 days)
    find $LOG_DIR -name "*.log" -mtime +30 -delete 2>/dev/null || true
    
    # Clean npm cache
    npm cache clean --force 2>/dev/null || true
    
    # Clean Docker if used
    if command -v docker &> /dev/null; then
        docker system prune -f 2>/dev/null || true
    fi
    
    print_status "✅ Cleanup completed"
}

# Main function
main() {
    print_header "🚀 Car Salon 24/7 Server Startup"
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_error "Please don't run this script as root. Run as a regular user with sudo privileges."
        exit 1
    fi
    
    # Create directories
    create_directories
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if production backend is accessible
    print_status "📡 Checking production backend server..."
    if curl -s --max-time 10 http://72.60.108.222:4001 > /dev/null; then
        print_status "✅ Production backend is accessible at http://72.60.108.222:4001"
    else
        print_warning "⚠️  Production backend is not accessible. Continuing anyway..."
    fi
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "📦 Installing dependencies..."
        npm install --production
    fi
    
    # Create initial backup
    create_backup
    
    # Start services based on deployment method
    if [ -f "docker-compose.production.yml" ]; then
        print_status "🐳 Starting with Docker..."
        docker-compose -f docker-compose.production.yml up -d
    else
        print_status "🚀 Starting with PM2..."
        
        # Install PM2 if not present
        if ! command -v pm2 &> /dev/null; then
            print_status "Installing PM2..."
            npm install -g pm2
        fi
        
        # Start frontend with PM2
        pm2 delete $APP_NAME-frontend 2>/dev/null || true
        pm2 start npm --name "$APP_NAME-frontend" -- start:production
        pm2 save
        pm2 startup
    fi
    
    # Start nginx if not running
    if ! systemctl is-active --quiet nginx; then
        print_status "🌐 Starting Nginx..."
        sudo systemctl start nginx
        sudo systemctl enable nginx
    fi
    
    # Wait for services to start
    print_status "⏳ Waiting for services to start..."
    sleep 10
    
    # Initial health check
    print_status "🔍 Performing initial health checks..."
    health_check "Frontend" $FRONTEND_PORT "http://localhost:$FRONTEND_PORT"
    health_check "Nginx" 80 "http://localhost"
    
    print_header "🎉 24/7 Server Started Successfully!"
    
    echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
    echo "🌐 Nginx: http://localhost"
    echo "📡 Backend: http://72.60.108.222:4001"
    echo "📊 Monitoring: Every $HEALTH_CHECK_INTERVAL seconds"
    echo "📦 Backups: $BACKUP_DIR"
    echo "📝 Logs: $LOG_DIR"
    echo ""
    echo "🔄 Auto-restart: Enabled (max $MAX_RESTART_ATTEMPTS attempts)"
    echo "💾 Auto-backup: Daily at 2 AM"
    echo "🧹 Auto-cleanup: Weekly"
    echo ""
    echo "Press Ctrl+C to stop monitoring (services will continue running)"
    
    # Set up signal handlers
    trap 'print_status "🛑 Monitoring stopped. Services continue running."; exit 0' SIGINT SIGTERM
    
    # Start monitoring loop
    monitor_services
}

# Run main function
main "$@"

