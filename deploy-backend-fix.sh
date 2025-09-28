#!/bin/bash

# Deploy Backend Connection Fix to Server
set -e

echo "🔧 Deploying backend connection fix to server..."

# Upload fixed files
scp nginx-car-salon-fixed.conf root@72.60.108.222:/tmp/
scp .env.fixed root@72.60.108.222:/tmp/

# Apply fixes on server
ssh root@72.60.108.222 << 'EOF'
set -e

echo "🔧 Applying backend connection fixes..."

# Update nginx configuration
sudo cp /tmp/nginx-car-salon-fixed.conf /etc/nginx/sites-available/car-salon
sudo ln -sf /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/

# Update environment configuration
sudo cp /tmp/.env.fixed /var/www/car-salon/.env

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart Car Salon service
sudo systemctl restart avto-salon

# Check status
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "✅ Backend connection fix applied successfully!"
echo ""
echo "🌐 Test your Car Salon:"
echo "   Frontend: http://72.60.108.222:3001"
echo "   API: http://72.60.108.222:3001/api"
echo "   GraphQL: http://72.60.108.222:3001/graphql"
echo ""
echo "🔍 Check if data is loading now!"
