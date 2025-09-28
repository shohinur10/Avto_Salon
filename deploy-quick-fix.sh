#!/bin/bash

# Deploy Quick WebSocket Fix to Server
set -e

echo "🔧 Deploying quick WebSocket fix to server..."

# Upload environment file
scp .env.websocket-disabled root@72.60.108.222:/tmp/

# Apply fix on server
ssh root@72.60.108.222 << 'EOF'
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
echo "   Frontend: http://72.60.108.222:3001"
echo "   Check browser console - WebSocket errors should be gone"
echo ""
echo "📋 Your Car Salon will work without real-time features"
echo "   (which is fine for most use cases)"
