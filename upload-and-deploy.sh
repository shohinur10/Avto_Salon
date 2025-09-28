#!/bin/bash

# Upload and Deploy Car Salon to Your Server
# This script uploads the deployment package and deploys it automatically

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
SERVER_IP="72.60.108.222"
SERVER_USER="root"
FRONTEND_PORT="3001"

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

# Check if deployment package exists
if [ ! -f "car-salon-deployment.tar.gz" ]; then
    print_error "Deployment package not found. Please run ./deploy-to-existing-server.sh first."
    exit 1
fi

print_header "Uploading and Deploying Car Salon to Your Server"

# Get server credentials
echo "Enter your server details:"
read -p "Server username (default: root): " input_user
SERVER_USER=${input_user:-root}

read -p "SSH key path (optional, press Enter to skip): " ssh_key_path

# Build SSH command
SSH_CMD="ssh"
if [ ! -z "$ssh_key_path" ]; then
    SSH_CMD="ssh -i $ssh_key_path"
fi

print_status "Uploading deployment package to server..."

# Upload the package
if [ ! -z "$ssh_key_path" ]; then
    scp -i "$ssh_key_path" car-salon-deployment.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
else
    scp car-salon-deployment.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
fi

print_status "Package uploaded successfully!"

print_status "Deploying on server..."

# Deploy on server
$SSH_CMD $SERVER_USER@$SERVER_IP << 'EOF'
set -e

echo "🚀 Starting Car Salon deployment on server..."

# Extract the package
cd /tmp
tar -xzf car-salon-deployment.tar.gz

# Move to application directory
sudo mv deployment-package /var/www/car-salon
cd /var/www/car-salon

# Make scripts executable
chmod +x *.sh

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "📦 Installing application dependencies..."
npm install --production

# Install and start systemd services
echo "⚙️ Installing systemd services..."
sudo ./install-systemd-services.sh

# Configure nginx
echo "🌐 Configuring nginx..."
sudo cp nginx-car-salon.conf /etc/nginx/sites-available/car-salon
sudo ln -sf /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Check service status
echo "📊 Checking service status..."
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "🎉 Car Salon deployment completed successfully!"
echo ""
echo "🌐 Your applications are now available at:"
echo "   Car Salon: http://72.60.108.222:3001"
echo "   Furniture Project: http://72.60.108.222 (unchanged)"
echo ""
echo "📋 Management commands:"
echo "   Check status: sudo systemctl status avto-salon"
echo "   View logs: sudo journalctl -u avto-salon -f"
echo "   Restart: sudo systemctl restart avto-salon"
echo ""
echo "✅ Car Salon is now running 24/7 on your server!"
EOF

print_header "Deployment Complete!"

echo "🎉 Car Salon has been successfully deployed to your server!"
echo ""
echo "🌐 Access your applications:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "📋 Your Car Salon now has:"
echo "   ✅ 24/7 operation with auto-restart"
echo "   ✅ Health monitoring every 30 seconds"
echo "   ✅ Daily automated backups"
echo "   ✅ Email notifications for issues"
echo "   ✅ System resource monitoring"
echo ""
echo "🔧 To manage your Car Salon:"
echo "   SSH: ssh $SERVER_USER@$SERVER_IP"
echo "   Status: sudo systemctl status avto-salon"
echo "   Logs: sudo journalctl -u avto-salon -f"
echo "   Restart: sudo systemctl restart avto-salon"
echo ""
echo "📚 Full documentation: /var/www/car-salon/24-7-DEPLOYMENT-GUIDE.md"

print_status "🚀 Your Car Salon is now running 24/7 alongside your furniture project!"


