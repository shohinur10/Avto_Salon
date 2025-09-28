#!/bin/bash

# Car Salon Health Monitor Script
# This script continuously monitors the health of all services
# and automatically restarts them if they fail

set -e

# Configuration
APP_NAME="avto-salon"
FRONTEND_PORT=3000
API_PORT=4001
HEALTH_CHECK_INTERVAL=30
MAX_RESTART_ATTEMPTS=5
RESTART_DELAY=10
LOG_DIR="/var/log/avto-salon"
ALERT_EMAIL="admin@yourdomain.com"  # Change this to your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1"
    echo -e "${GREEN}$message${NC}"
    echo "$message" >> $LOG_DIR/health-monitor.log
}

print_warning() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> $LOG_DIR/health-monitor.log
}

print_error() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> $LOG_DIR/health-monitor.log
}

# Create log directory if it doesn't exist
mkdir -p $LOG_DIR

# Health check function
health_check() {
    local service_name=$1
    local port=$2
    local url=$3
    local timeout=${4:-10}
    
    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        print_status "✅ $service_name is healthy (port $port)"
        return 0
    else
        print_error "❌ $service_name is not responding (port $port)"
        return 1
    fi
}

# Send alert function
send_alert() {
    local subject=$1
    local message=$2
    
    # Log the alert
    print_error "🚨 ALERT: $subject - $message"
    
    # Send email if mail command is available
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" $ALERT_EMAIL 2>/dev/null || true
    fi
    
    # Send to system log
    logger -t avto-salon-monitor "ALERT: $subject - $message"
}

# Restart service function
restart_service() {
    local service_name=$1
    local restart_count=$2
    
    if [ $restart_count -ge $MAX_RESTART_ATTEMPTS ]; then
        send_alert "CRITICAL: $service_name Failed" "Maximum restart attempts ($MAX_RESTART_ATTEMPTS) reached for $service_name. Manual intervention required!"
        return 1
    fi
    
    print_warning "🔄 Restarting $service_name (attempt $((restart_count + 1))/$MAX_RESTART_ATTEMPTS)..."
    
    case $service_name in
        "frontend")
            if command -v pm2 &> /dev/null; then
                pm2 restart $APP_NAME-frontend 2>/dev/null || {
                    pm2 delete $APP_NAME-frontend 2>/dev/null || true
                    cd /var/www/avto-salon
                    pm2 start npm --name "$APP_NAME-frontend" -- start:production
                }
            else
                pkill -f "next start" || true
                sleep 2
                cd /var/www/avto-salon
                npm run start:production &
            fi
            ;;
        "nginx")
            sudo systemctl restart nginx
            ;;
        "docker")
            cd /var/www/avto-salon
            docker-compose -f docker-compose.production.yml restart
            ;;
    esac
    
    sleep $RESTART_DELAY
    return 0
}

# Check system resources
check_system_resources() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    local memory_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    # Check CPU usage
    if (( $(echo "$cpu_usage > 90" | bc -l) )); then
        send_alert "High CPU Usage" "CPU usage is at ${cpu_usage}%"
    fi
    
    # Check memory usage
    if (( $(echo "$memory_usage > 90" | bc -l) )); then
        send_alert "High Memory Usage" "Memory usage is at ${memory_usage}%"
    fi
    
    # Check disk usage
    if [ $disk_usage -gt 90 ]; then
        send_alert "High Disk Usage" "Disk usage is at ${disk_usage}%"
    fi
    
    print_status "📊 System Resources - CPU: ${cpu_usage}%, Memory: ${memory_usage}%, Disk: ${disk_usage}%"
}

# Check backend connectivity
check_backend_connectivity() {
    local backend_url="http://72.60.108.222:4001"
    local graphql_url="http://72.60.108.222:4001/graphql"
    
    # Check basic backend
    if ! curl -s --max-time 10 "$backend_url" > /dev/null 2>&1; then
        print_warning "⚠️  Backend server is not accessible"
        return 1
    fi
    
    # Check GraphQL endpoint
    if ! curl -s --max-time 10 -X POST -H "Content-Type: application/json" \
         -d '{"query":"{ __typename }"}' "$graphql_url" > /dev/null 2>&1; then
        print_warning "⚠️  GraphQL API is not accessible"
        return 1
    fi
    
    print_status "✅ Backend connectivity is healthy"
    return 0
}

# Main monitoring loop
monitor_services() {
    print_status "🔍 Starting health monitoring..."
    
    local frontend_restart_count=0
    local nginx_restart_count=0
    local docker_restart_count=0
    local backend_fail_count=0
    
    while true; do
        print_status "🔍 Performing health checks..."
        
        # Check system resources
        check_system_resources
        
        # Check backend connectivity
        if ! check_backend_connectivity; then
            backend_fail_count=$((backend_fail_count + 1))
            if [ $backend_fail_count -ge 3 ]; then
                send_alert "Backend Connectivity Issue" "Backend has been unreachable for $((backend_fail_count * HEALTH_CHECK_INTERVAL)) seconds"
            fi
        else
            backend_fail_count=0
        fi
        
        # Check frontend
        if ! health_check "Frontend" $FRONTEND_PORT "http://localhost:$FRONTEND_PORT"; then
            if restart_service "frontend" $frontend_restart_count; then
                frontend_restart_count=$((frontend_restart_count + 1))
                send_alert "Frontend Restart" "Frontend service was restarted (attempt $frontend_restart_count)"
            else
                frontend_restart_count=$MAX_RESTART_ATTEMPTS
            fi
        else
            if [ $frontend_restart_count -gt 0 ]; then
                print_status "✅ Frontend service recovered successfully"
                frontend_restart_count=0
            fi
        fi
        
        # Check nginx
        if ! health_check "Nginx" 80 "http://localhost"; then
            if restart_service "nginx" $nginx_restart_count; then
                nginx_restart_count=$((nginx_restart_count + 1))
                send_alert "Nginx Restart" "Nginx service was restarted (attempt $nginx_restart_count)"
            else
                nginx_restart_count=$MAX_RESTART_ATTEMPTS
            fi
        else
            if [ $nginx_restart_count -gt 0 ]; then
                print_status "✅ Nginx service recovered successfully"
                nginx_restart_count=0
            fi
        fi
        
        # Check if using Docker
        if [ -f "/var/www/avto-salon/docker-compose.production.yml" ]; then
            if ! docker-compose -f /var/www/avto-salon/docker-compose.production.yml ps | grep -q "Up"; then
                if restart_service "docker" $docker_restart_count; then
                    docker_restart_count=$((docker_restart_count + 1))
                    send_alert "Docker Restart" "Docker services were restarted (attempt $docker_restart_count)"
                else
                    docker_restart_count=$MAX_RESTART_ATTEMPTS
                fi
            else
                if [ $docker_restart_count -gt 0 ]; then
                    print_status "✅ Docker services recovered successfully"
                    docker_restart_count=0
                fi
            fi
        fi
        
        # Log successful health check
        echo "$(date '+%Y-%m-%d %H:%M:%S') - All services healthy" >> $LOG_DIR/health.log
        
        print_status "💤 Sleeping for $HEALTH_CHECK_INTERVAL seconds..."
        sleep $HEALTH_CHECK_INTERVAL
    done
}

# Cleanup function
cleanup() {
    print_status "🧹 Cleaning up old logs..."
    
    # Keep only last 30 days of logs
    find $LOG_DIR -name "*.log" -mtime +30 -delete 2>/dev/null || true
    
    # Rotate large log files
    if [ -f "$LOG_DIR/health-monitor.log" ] && [ $(stat -f%z "$LOG_DIR/health-monitor.log" 2>/dev/null || stat -c%s "$LOG_DIR/health-monitor.log" 2>/dev/null || echo 0) -gt 10485760 ]; then
        mv "$LOG_DIR/health-monitor.log" "$LOG_DIR/health-monitor.log.old"
        touch "$LOG_DIR/health-monitor.log"
    fi
}

# Main function
main() {
    print_status "🚀 Starting Car Salon Health Monitor"
    
    # Check if we're in the right directory
    if [ ! -d "/var/www/avto-salon" ]; then
        print_error "Application directory not found. Please run install-systemd-services.sh first."
        exit 1
    fi
    
    # Set up signal handlers
    trap 'print_status "🛑 Health monitor stopped."; exit 0' SIGINT SIGTERM
    
    # Initial cleanup
    cleanup
    
    # Start monitoring
    monitor_services
}

# Run main function
main "$@"
