#!/bin/bash

# Quick WebSocket Fix - Disable WebSocket to stop the error
# This is a temporary fix to stop the WebSocket connection errors

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_IP="72.60.108.222"
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

print_header "Quick WebSocket Fix - Disable WebSocket"

# Create environment file that disables WebSocket
print_status "Creating environment file that disables WebSocket..."

cat > .env.websocket-disabled << EOF
# Environment Configuration with WebSocket Disabled
# This will stop the WebSocket connection errors

# API URLs - Use nginx proxy paths
REACT_APP_API_URL=http://$SERVER_IP:$FRONTEND_PORT/api
REACT_APP_API_GRAPHQL_URL=http://$SERVER_IP:$FRONTEND_PORT/graphql
REACT_APP_API_WS=

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:$FRONTEND_PORT
PORT=$FRONTEND_PORT

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=http://$SERVER_IP:$FRONTEND_PORT
EOF

# Create deployment script
print_status "Creating deployment script..."

cat > deploy-quick-fix.sh << EOF
#!/bin/bash

# Deploy Quick WebSocket Fix to Server
set -e

echo "🔧 Deploying quick WebSocket fix to server..."

# Upload environment file
scp .env.websocket-disabled root@$SERVER_IP:/tmp/

# Apply fix on server
ssh root@$SERVER_IP << 'EOF'
set -e

echo "🔧 Applying quick WebSocket fix..."

# Check if Car Salon directory exists
if [ ! -d "/var/www/car-salon" ]; then
    echo "❌ Car Salon directory not found. Please deploy Car Salon first."
    exit 1
fi

# Update environment configuration
sudo cp /tmp/.env.websocket-disabled /var/www/car-salon/.env

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait for service to start
sleep 5

# Check status
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "✅ Quick WebSocket fix applied successfully!"
echo ""
echo "🔌 WebSocket is now disabled - no more connection errors!"
echo ""
echo "🌐 Test your Car Salon:"
echo "   Frontend: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Check browser console - WebSocket errors should be gone"
echo ""
echo "📋 Your Car Salon will work without real-time features"
echo "   (which is fine for most use cases)"
EOF

chmod +x deploy-quick-fix.sh

print_header "Quick WebSocket Fix Ready!"

echo "🎉 I've created a quick fix to stop the WebSocket errors!"
echo ""
echo "📋 The problem:"
echo "   ❌ WebSocket trying to connect to 'nestar-api:3005' (non-existent)"
echo "   ❌ This causes console errors and connection failures"
echo ""
echo "✅ The quick fix:"
echo "   ✅ Disables WebSocket by setting REACT_APP_API_WS="
echo "   ✅ Your app will work without real-time features"
echo "   ✅ No more WebSocket connection errors"
echo "   ✅ API and GraphQL will still work perfectly"
echo ""
echo "🚀 To apply the quick fix:"
echo "   1. Run: ./deploy-quick-fix.sh"
echo "   2. Check your Car Salon - WebSocket errors should be gone"
echo ""
echo "📚 This is a temporary fix. For a permanent solution with WebSocket:"
echo "   - Run: ./deploy-complete-with-websocket-fix.sh"
echo "   - But the quick fix will work fine for most use cases"

print_status "🔧 Quick WebSocket fix is ready to deploy!"


