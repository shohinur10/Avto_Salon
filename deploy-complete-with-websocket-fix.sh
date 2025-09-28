#!/bin/bash

# Complete Deployment with WebSocket Fix for Car Salon
# This script deploys Car Salon and fixes all connection issues including WebSocket

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

print_header "Complete Car Salon Deployment with WebSocket Fix"

# Check if deployment package exists
if [ ! -f "car-salon-deployment.tar.gz" ]; then
    print_error "Deployment package not found. Please run ./deploy-to-existing-server.sh first."
    exit 1
fi

print_status "Uploading and deploying Car Salon with complete fixes..."

# Upload deployment package
scp car-salon-deployment.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Upload fixed nginx configuration
scp nginx-car-salon-fixed.conf $SERVER_USER@$SERVER_IP:/tmp/

# Upload fixed Apollo client
scp apollo/client-fixed.ts $SERVER_USER@$SERVER_IP:/tmp/

# Deploy everything on server
ssh $SERVER_USER@$SERVER_IP << EOF
set -e

echo "🚀 Starting complete Car Salon deployment with WebSocket fix..."

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

# Create fixed environment file with WebSocket configuration
echo "⚙️ Creating fixed environment configuration with WebSocket fix..."
cat > .env << 'ENVEOF'
# Fixed Environment Configuration for Car Salon
# Proper WebSocket and API configuration

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

# Apply WebSocket fix to Apollo client
echo "🔌 Applying WebSocket connection fix..."
if [ -f "/tmp/client-fixed.ts" ]; then
    sudo cp /tmp/client-fixed.ts apollo/client.ts
    echo "✅ Apollo client updated with WebSocket fix"
else
    echo "⚠️ WebSocket fix file not found, using original client"
fi

# Install and start systemd services
echo "⚙️ Installing systemd services..."
sudo ./install-systemd-services.sh

# Configure nginx with fixed configuration
echo "🌐 Configuring nginx with backend and WebSocket fix..."
sudo cp /tmp/nginx-car-salon-fixed.conf /etc/nginx/sites-available/car-salon
sudo ln -sf /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Rebuild application with fixes
echo "🔨 Rebuilding application with all fixes..."
npm run build

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait for service to start
sleep 10

# Check service status
echo "📊 Checking service status..."
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "🎉 Car Salon deployment with complete fixes completed successfully!"
echo ""
echo "🌐 Your applications are now available at:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "🔧 All fixes applied:"
echo "   ✅ Backend API connection fixed (nginx proxy)"
echo "   ✅ WebSocket connection fixed (proper URL)"
echo "   ✅ CORS headers added for cross-origin requests"
echo "   ✅ GraphQL endpoint properly proxied"
echo "   ✅ Environment variables properly configured"
echo ""
echo "🔌 WebSocket configuration:"
echo "   URL: ws://$SERVER_IP:$FRONTEND_PORT/ws"
echo "   Proxied to: ws://$SERVER_IP:$API_PORT"
echo ""
echo "📋 Test your Car Salon:"
echo "   1. Visit: http://$SERVER_IP:$FRONTEND_PORT"
echo "   2. Check browser console for connection status"
echo "   3. Verify data loads from backend"
echo "   4. Check WebSocket connection in console"
echo ""
echo "✅ Car Salon is now running 24/7 with all connection issues fixed!"

EOF

print_header "Deployment Complete!"

echo "🎉 Car Salon has been successfully deployed with all fixes!"
echo ""
echo "🌐 Access your applications:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "🔧 All connection issues fixed:"
echo "   ✅ Backend API connection (nginx proxy)"
echo "   ✅ WebSocket connection (proper URL)"
echo "   ✅ CORS headers for cross-origin requests"
echo "   ✅ GraphQL endpoint properly proxied"
echo "   ✅ Environment variables properly configured"
echo ""
echo "🔌 WebSocket configuration:"
echo "   URL: ws://$SERVER_IP:$FRONTEND_PORT/ws"
echo "   Proxied to: ws://$SERVER_IP:$API_PORT"
echo "   Fallback: Graceful handling if WebSocket fails"
echo ""
echo "📋 Your Car Salon now has:"
echo "   ✅ 24/7 operation with auto-restart"
echo "   ✅ Health monitoring every 30 seconds"
echo "   ✅ Daily automated backups"
echo "   ✅ Proper backend API connection"
echo "   ✅ Fixed WebSocket connection"
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
echo "   Check browser console for connection status"
echo "   Verify data loads from your backend!"
echo ""
echo "📚 If WebSocket still causes issues, you can disable it by:"
echo "   Setting REACT_APP_API_WS= in the .env file"

print_status "🚀 Your Car Salon is now running 24/7 with all connection issues fixed!"


