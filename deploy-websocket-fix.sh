#!/bin/bash

# Deploy WebSocket Connection Fix to Server
set -e

echo "🔌 Deploying WebSocket connection fix to server..."

# Upload fixed files
scp apollo/client-fixed.ts root@72.60.108.222:/tmp/
scp .env.websocket-fixed root@72.60.108.222:/tmp/

# Apply fixes on server
ssh root@72.60.108.222 << 'EOF'
set -e

echo "🔌 Applying WebSocket connection fixes..."

# Backup original Apollo client
if [ -f "/var/www/car-salon/apollo/client.ts" ]; then
    sudo cp /var/www/car-salon/apollo/client.ts /var/www/car-salon/apollo/client.ts.backup
fi

# Update Apollo client
sudo cp /tmp/client-fixed.ts /var/www/car-salon/apollo/client.ts

# Update environment configuration
sudo cp /tmp/.env.websocket-fixed /var/www/car-salon/.env

# Rebuild the application
cd /var/www/car-salon
echo "🔨 Rebuilding application with WebSocket fix..."
npm run build

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait for service to start
sleep 10

# Check status
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "✅ WebSocket connection fix applied successfully!"
echo ""
echo "🔌 WebSocket configuration:"
echo "   URL: ws://72.60.108.222:3001/ws"
echo "   Proxied to: ws://72.60.108.222:4001"
echo ""
echo "🌐 Test your Car Salon:"
echo "   Frontend: http://72.60.108.222:3001"
echo "   Check browser console for WebSocket connection status"
echo ""
echo "📋 If WebSocket still fails, you can disable it by setting:"
echo "   REACT_APP_API_WS= in the .env file"
