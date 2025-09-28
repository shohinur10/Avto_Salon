#!/bin/bash

# Complete Deployment and Fix for Car Salon
# This script deploys Car Salon and fixes backend connection issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_IP="72.60.108.222"
SERVER_USER="root"
FRONTEND_PORT="3001"
API_PORT="4001"

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

print_header "Complete Car Salon Deployment with Backend Fix"

# Check if deployment package exists
if [ ! -f "car-salon-deployment.tar.gz" ]; then
    print_error "Deployment package not found. Please run ./deploy-to-existing-server.sh first."
    exit 1
fi

print_status "Uploading and deploying Car Salon with backend fix..."

# Upload deployment package
scp car-salon-deployment.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Upload fixed nginx configuration
scp nginx-car-salon-fixed.conf $SERVER_USER@$SERVER_IP:/tmp/

# Deploy everything on server
ssh $SERVER_USER@$SERVER_IP << EOF
set -e

echo "🚀 Starting complete Car Salon deployment with backend fix..."

# Extract deployment package
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

# Create fixed environment file
echo "⚙️ Creating fixed environment configuration..."
cat > .env << 'ENVEOF'
# Fixed Environment Configuration for Car Salon
# Using nginx proxy paths for proper backend connection

# API URLs - Use nginx proxy paths
REACT_APP_API_URL=http://$SERVER_IP:$FRONTEND_PORT/api
REACT_APP_API_GRAPHQL_URL=http://$SERVER_IP:$FRONTEND_PORT/graphql
REACT_APP_API_WS=ws://$SERVER_IP:$FRONTEND_PORT/ws

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:$FRONTEND_PORT
PORT=$FRONTEND_PORT

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=http://$SERVER_IP:$FRONTEND_PORT
ENVEOF

# Install and start systemd services
echo "⚙️ Installing systemd services..."
sudo ./install-systemd-services.sh

# Configure nginx with fixed configuration
echo "🌐 Configuring nginx with backend fix..."
sudo cp /tmp/nginx-car-salon-fixed.conf /etc/nginx/sites-available/car-salon
sudo ln -sf /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait a moment for service to start
sleep 5

# Check service status
echo "📊 Checking service status..."
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "🎉 Car Salon deployment with backend fix completed successfully!"
echo ""
echo "🌐 Your applications are now available at:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "🔍 Backend connection fix applied:"
echo "   API calls now go through nginx proxy"
echo "   CORS headers added for cross-origin requests"
echo "   GraphQL endpoint properly proxied"
echo ""
echo "📋 Test your Car Salon:"
echo "   1. Visit: http://$SERVER_IP:$FRONTEND_PORT"
echo "   2. Check if data loads from backend"
echo "   3. Test API: http://$SERVER_IP:$FRONTEND_PORT/api"
echo "   4. Test GraphQL: http://$SERVER_IP:$FRONTEND_PORT/graphql"
echo ""
echo "✅ Car Salon is now running 24/7 with proper backend connection!"

EOF

print_header "Deployment Complete!"

echo "🎉 Car Salon has been successfully deployed with backend fix!"
echo ""
echo "🌐 Access your applications:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "🔧 Backend connection issues fixed:"
echo "   ✅ API calls now go through nginx proxy"
echo "   ✅ CORS headers added for cross-origin requests"
echo "   ✅ GraphQL endpoint properly proxied"
echo "   ✅ WebSocket support configured"
echo ""
echo "📋 Your Car Salon now has:"
echo "   ✅ 24/7 operation with auto-restart"
echo "   ✅ Health monitoring every 30 seconds"
echo "   ✅ Daily automated backups"
echo "   ✅ Proper backend API connection"
echo "   ✅ Email notifications for issues"
echo ""
echo "🔧 To manage your Car Salon:"
echo "   SSH: ssh $SERVER_USER@$SERVER_IP"
echo "   Status: sudo systemctl status avto-salon"
echo "   Logs: sudo journalctl -u avto-salon -f"
echo "   Restart: sudo systemctl restart avto-salon"
echo ""
echo "🧪 Test your Car Salon now:"
echo "   Visit: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Check if data loads from your backend!"

print_status "🚀 Your Car Salon is now running 24/7 with proper backend connection!"


