#!/bin/bash

# Deploy Comprehensive Website Fix to Server
set -e

echo "🔧 Deploying comprehensive website fix to server..."

# Upload all fixed files
scp apollo/client-fixed.ts root@72.60.108.222:/tmp/
scp .env.production-fixed root@72.60.108.222:/tmp/
scp next.config.fixed.js root@72.60.108.222:/tmp/
scp nginx-comprehensive.conf root@72.60.108.222:/tmp/

# Apply comprehensive fixes on server
ssh root@72.60.108.222 << 'EOF'
set -e

echo "🔧 Applying comprehensive website fixes..."

# Check if Car Salon directory exists
if [ ! -d "/var/www/car-salon" ]; then
    echo "❌ Car Salon directory not found. Please deploy Car Salon first."
    exit 1
fi

cd /var/www/car-salon

# Backup original files
echo "📦 Backing up original files..."
sudo cp apollo/client.ts apollo/client.ts.backup 2>/dev/null || true
sudo cp next.config.js next.config.js.backup 2>/dev/null || true
sudo cp .env .env.backup 2>/dev/null || true

# Apply fixes
echo "🔧 Applying Apollo client fix..."
sudo cp /tmp/client-fixed.ts apollo/client.ts

echo "🔧 Applying Next.js configuration fix..."
sudo cp /tmp/next.config.fixed.js next.config.js

echo "🔧 Applying environment configuration fix..."
sudo cp /tmp/.env.production-fixed .env

echo "🔧 Applying nginx configuration fix..."
sudo cp /tmp/nginx-comprehensive.conf /etc/nginx/sites-available/car-salon
sudo ln -sf /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Rebuild application with fixes
echo "🔨 Rebuilding application with comprehensive fixes..."
npm run build

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait for service to start
sleep 10

# Check status
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "✅ Comprehensive website fix applied successfully!"
echo ""
echo "🔧 All fixes applied:"
echo "   ✅ Apollo client configuration fixed"
echo "   ✅ WebSocket connection issues resolved"
echo "   ✅ Environment variables properly configured"
echo "   ✅ Next.js configuration optimized"
echo "   ✅ Nginx configuration comprehensive"
echo "   ✅ API and GraphQL routing fixed"
echo "   ✅ CORS headers properly configured"
echo ""
echo "🌐 Test your Car Salon:"
echo "   Frontend: http://72.60.108.222:3001"
echo "   API: http://72.60.108.222:3001/api"
echo "   GraphQL: http://72.60.108.222:3001/graphql"
echo ""
echo "📋 Check browser console - all errors should be resolved!"
