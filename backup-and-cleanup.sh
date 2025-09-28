#!/bin/bash

# Car Salon Backup and Cleanup Script
# This script creates backups and performs maintenance tasks
# Runs daily via systemd timer

set -e

# Configuration
APP_DIR="/var/www/avto-salon"
BACKUP_DIR="/var/backups/avto-salon"
LOG_DIR="/var/log/avto-salon"
RETENTION_DAYS=30
MAX_BACKUP_SIZE="10G"
NOTIFICATION_EMAIL="admin@yourdomain.com"  # Change this to your email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $1"
    echo -e "${GREEN}$message${NC}"
    echo "$message" >> $LOG_DIR/backup.log
}

print_warning() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [WARNING] $1"
    echo -e "${YELLOW}$message${NC}"
    echo "$message" >> $LOG_DIR/backup.log
}

print_error() {
    local message="[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1"
    echo -e "${RED}$message${NC}"
    echo "$message" >> $LOG_DIR/backup.log
}

# Create directories if they don't exist
mkdir -p $BACKUP_DIR
mkdir -p $LOG_DIR

# Send notification function
send_notification() {
    local subject=$1
    local message=$2
    
    # Log the notification
    print_status "📧 NOTIFICATION: $subject - $message"
    
    # Send email if mail command is available
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" $NOTIFICATION_EMAIL 2>/dev/null || true
    fi
    
    # Send to system log
    logger -t avto-salon-backup "NOTIFICATION: $subject - $message"
}

# Create application backup
create_application_backup() {
    print_status "📦 Creating application backup..."
    
    local backup_file="$BACKUP_DIR/app-backup-$(date '+%Y%m%d-%H%M%S').tar.gz"
    local temp_dir="/tmp/avto-salon-backup-$$"
    
    # Create temporary directory
    mkdir -p "$temp_dir"
    
    # Copy application files (excluding large directories)
    rsync -av --exclude=node_modules \
              --exclude=.next \
              --exclude=.git \
              --exclude=*.log \
              --exclude=*.tmp \
              "$APP_DIR/" "$temp_dir/"
    
    # Create compressed archive
    tar -czf "$backup_file" -C "$temp_dir" .
    
    # Clean up temporary directory
    rm -rf "$temp_dir"
    
    # Check backup size
    local backup_size=$(du -h "$backup_file" | cut -f1)
    print_status "✅ Application backup created: $backup_file ($backup_size)"
    
    # Verify backup integrity
    if tar -tzf "$backup_file" > /dev/null 2>&1; then
        print_status "✅ Backup integrity verified"
    else
        print_error "❌ Backup integrity check failed"
        rm -f "$backup_file"
        return 1
    fi
    
    echo "$backup_file"
}

# Create database backup (if applicable)
create_database_backup() {
    print_status "🗄️  Creating database backup..."
    
    # This is a placeholder for database backup
    # Add your database backup logic here if you have a database
    
    # Example for PostgreSQL:
    # pg_dump -h localhost -U username -d database_name > "$BACKUP_DIR/db-backup-$(date '+%Y%m%d-%H%M%S').sql"
    
    # Example for MySQL:
    # mysqldump -h localhost -u username -p database_name > "$BACKUP_DIR/db-backup-$(date '+%Y%m%d-%H%M%S').sql"
    
    print_status "ℹ️  No database configured for backup"
}

# Create configuration backup
create_config_backup() {
    print_status "⚙️  Creating configuration backup..."
    
    local config_backup="$BACKUP_DIR/config-backup-$(date '+%Y%m%d-%H%M%S').tar.gz"
    
    # Backup important configuration files
    tar -czf "$config_backup" \
        /etc/nginx/sites-available/avto-salon* \
        /etc/systemd/system/avto-salon* \
        /var/www/avto-salon/.env* \
        /var/www/avto-salon/package.json \
        /var/www/avto-salon/next.config.js \
        2>/dev/null || true
    
    if [ -f "$config_backup" ]; then
        local config_size=$(du -h "$config_backup" | cut -f1)
        print_status "✅ Configuration backup created: $config_backup ($config_size)"
    else
        print_warning "⚠️  No configuration files found to backup"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    print_status "🧹 Cleaning up old backups..."
    
    local deleted_count=0
    
    # Remove backups older than retention period
    while IFS= read -r -d '' file; do
        rm -f "$file"
        deleted_count=$((deleted_count + 1))
    done < <(find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -print0 2>/dev/null)
    
    if [ $deleted_count -gt 0 ]; then
        print_status "✅ Removed $deleted_count old backup files"
    else
        print_status "ℹ️  No old backup files to remove"
    fi
    
    # Check total backup size
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    print_status "📊 Total backup directory size: $total_size"
}

# Cleanup application logs
cleanup_logs() {
    print_status "🧹 Cleaning up application logs..."
    
    local deleted_count=0
    
    # Remove logs older than retention period
    while IFS= read -r -d '' file; do
        rm -f "$file"
        deleted_count=$((deleted_count + 1))
    done < <(find "$LOG_DIR" -name "*.log" -mtime +$RETENTION_DAYS -print0 2>/dev/null)
    
    # Rotate large log files
    for log_file in "$LOG_DIR"/*.log; do
        if [ -f "$log_file" ] && [ $(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null || echo 0) -gt 10485760 ]; then
            mv "$log_file" "${log_file}.old"
            touch "$log_file"
            print_status "🔄 Rotated large log file: $(basename "$log_file")"
        fi
    done
    
    if [ $deleted_count -gt 0 ]; then
        print_status "✅ Removed $deleted_count old log files"
    else
        print_status "ℹ️  No old log files to remove"
    fi
}

# Cleanup system resources
cleanup_system() {
    print_status "🧹 Cleaning up system resources..."
    
    # Clean npm cache
    if command -v npm &> /dev/null; then
        npm cache clean --force 2>/dev/null || true
        print_status "✅ NPM cache cleaned"
    fi
    
    # Clean Docker if used
    if command -v docker &> /dev/null; then
        docker system prune -f 2>/dev/null || true
        print_status "✅ Docker system cleaned"
    fi
    
    # Clean temporary files
    find /tmp -name "avto-salon-*" -mtime +1 -delete 2>/dev/null || true
    print_status "✅ Temporary files cleaned"
}

# Update application dependencies
update_dependencies() {
    print_status "📦 Checking for dependency updates..."
    
    cd "$APP_DIR"
    
    # Check for outdated packages
    if [ -f "package.json" ]; then
        local outdated_count=$(npm outdated --json 2>/dev/null | jq 'length' 2>/dev/null || echo "0")
        
        if [ "$outdated_count" -gt 0 ]; then
            print_warning "⚠️  Found $outdated_count outdated dependencies"
            send_notification "Dependency Updates Available" "Found $outdated_count outdated dependencies. Consider updating them during maintenance window."
        else
            print_status "✅ All dependencies are up to date"
        fi
    fi
}

# Generate backup report
generate_report() {
    print_status "📊 Generating backup report..."
    
    local report_file="$LOG_DIR/backup-report-$(date '+%Y%m%d').txt"
    
    {
        echo "Car Salon Backup Report - $(date)"
        echo "=================================="
        echo ""
        echo "Backup Directory: $BACKUP_DIR"
        echo "Total Backups: $(find "$BACKUP_DIR" -name "*.tar.gz" | wc -l)"
        echo "Total Size: $(du -sh "$BACKUP_DIR" | cut -f1)"
        echo ""
        echo "Recent Backups:"
        find "$BACKUP_DIR" -name "*.tar.gz" -mtime -7 -exec ls -lh {} \; | head -10
        echo ""
        echo "Log Directory: $LOG_DIR"
        echo "Total Log Files: $(find "$LOG_DIR" -name "*.log" | wc -l)"
        echo "Total Log Size: $(du -sh "$LOG_DIR" | cut -f1)"
        echo ""
        echo "System Resources:"
        echo "Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"
        echo "Memory Usage: $(free | grep Mem | awk '{printf("%.1f%%", $3/$2 * 100.0)}')"
        echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
    } > "$report_file"
    
    print_status "✅ Backup report generated: $report_file"
}

# Main function
main() {
    print_status "🚀 Starting Car Salon backup and cleanup process"
    
    local start_time=$(date +%s)
    local backup_files=()
    
    # Create backups
    if app_backup=$(create_application_backup); then
        backup_files+=("$app_backup")
    else
        print_error "❌ Application backup failed"
        send_notification "Backup Failed" "Application backup failed. Please check the logs."
        exit 1
    fi
    
    create_database_backup
    create_config_backup
    
    # Perform cleanup
    cleanup_old_backups
    cleanup_logs
    cleanup_system
    
    # Update dependencies
    update_dependencies
    
    # Generate report
    generate_report
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    print_status "✅ Backup and cleanup completed successfully in ${duration} seconds"
    
    # Send success notification
    local backup_count=${#backup_files[@]}
    send_notification "Backup Completed" "Successfully created $backup_count backup(s) and performed system cleanup in ${duration} seconds."
    
    print_status "🎉 All maintenance tasks completed successfully!"
}

# Run main function
main "$@"

