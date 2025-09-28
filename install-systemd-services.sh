#!/bin/bash

# Install Systemd Services for Car Salon 24/7 Operation
# This script installs and configures systemd services for automatic startup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root (use sudo)"
    exit 1
fi

print_header "Installing Car Salon Systemd Services"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Get the current user (who will own the application)
CURRENT_USER=$(logname 2>/dev/null || echo $SUDO_USER)
if [ -z "$CURRENT_USER" ]; then
    print_error "Could not determine the current user. Please run this script with sudo from your user account."
    exit 1
fi

print_status "Installing services for user: $CURRENT_USER"

# Create application directory
print_status "Creating application directory..."
mkdir -p /var/www/avto-salon
chown $CURRENT_USER:$CURRENT_USER /var/www/avto-salon

# Create log and backup directories
print_status "Creating log and backup directories..."
mkdir -p /var/log/avto-salon
mkdir -p /var/backups/avto-salon
chown $CURRENT_USER:$CURRENT_USER /var/log/avto-salon
chown $CURRENT_USER:$CURRENT_USER /var/backups/avto-salon

# Copy application files
print_status "Copying application files..."
cp -r . /var/www/avto-salon/
chown -R $CURRENT_USER:$CURRENT_USER /var/www/avto-salon

# Make scripts executable
print_status "Making scripts executable..."
chmod +x /var/www/avto-salon/start-24-7-server.sh
chmod +x /var/www/avto-salon/monitor-health.sh
chmod +x /var/www/avto-salon/backup-and-cleanup.sh

# Update service files with correct user
print_status "Updating service files..."
sed -i "s/User=www-data/User=$CURRENT_USER/g" systemd/avto-salon.service
sed -i "s/Group=www-data/Group=$CURRENT_USER/g" systemd/avto-salon.service
sed -i "s/User=www-data/User=$CURRENT_USER/g" systemd/avto-salon-monitor.service
sed -i "s/Group=www-data/Group=$CURRENT_USER/g" systemd/avto-salon-monitor.service
sed -i "s/User=www-data/User=$CURRENT_USER/g" systemd/avto-salon-backup.service
sed -i "s/Group=www-data/Group=$CURRENT_USER/g" systemd/avto-salon-backup.service

# Copy service files
print_status "Installing systemd service files..."
cp systemd/avto-salon.service /etc/systemd/system/
cp systemd/avto-salon-monitor.service /etc/systemd/system/
cp systemd/avto-salon-backup.service /etc/systemd/system/
cp systemd/avto-salon-backup.timer /etc/systemd/system/

# Reload systemd
print_status "Reloading systemd daemon..."
systemctl daemon-reload

# Enable services
print_status "Enabling services..."
systemctl enable avto-salon.service
systemctl enable avto-salon-monitor.service
systemctl enable avto-salon-backup.timer

# Start services
print_status "Starting services..."
systemctl start avto-salon.service
systemctl start avto-salon-monitor.service
systemctl start avto-salon-backup.timer

# Check service status
print_status "Checking service status..."
sleep 5

echo ""
print_header "Service Status"
systemctl status avto-salon.service --no-pager -l
echo ""
systemctl status avto-salon-monitor.service --no-pager -l
echo ""
systemctl status avto-salon-backup.timer --no-pager -l

print_header "Installation Complete!"

echo "🎉 Car Salon 24/7 services have been installed and started!"
echo ""
echo "📋 Services installed:"
echo "✅ avto-salon.service - Main application service"
echo "✅ avto-salon-monitor.service - Health monitoring"
echo "✅ avto-salon-backup.timer - Daily backups"
echo ""
echo "📋 Service management commands:"
echo "- Check status: sudo systemctl status avto-salon"
echo "- View logs: sudo journalctl -u avto-salon -f"
echo "- Restart: sudo systemctl restart avto-salon"
echo "- Stop: sudo systemctl stop avto-salon"
echo "- Start: sudo systemctl start avto-salon"
echo ""
echo "📋 Application will:"
echo "🔄 Auto-start on boot"
echo "🔄 Auto-restart on failure"
echo "📊 Monitor health every 30 seconds"
echo "💾 Create daily backups at 2 AM"
echo "🧹 Clean up old logs and backups"
echo ""
echo "🌐 Your application should be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Nginx: http://localhost"
echo ""
echo "📝 Logs are available at:"
echo "- Application logs: sudo journalctl -u avto-salon -f"
echo "- Monitor logs: sudo journalctl -u avto-salon-monitor -f"
echo "- Backup logs: sudo journalctl -u avto-salon-backup -f"
echo ""
echo "⚠️  Important: The application will now start automatically on boot!"
echo "   To disable auto-start: sudo systemctl disable avto-salon"

print_status "🚀 Your Car Salon is now running 24/7!"

