#!/bin/bash

# Fix Backend Connection Issues for Car Salon
# This script creates proper nginx configuration and environment setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_IP="72.60.108.222"
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

print_header "Fixing Backend Connection Issues"

# Create fixed nginx configuration
print_status "Creating fixed nginx configuration..."

cat > nginx-car-salon-fixed.conf << EOF
# Fixed Nginx configuration for Car Salon with proper API proxy
server {
    listen 3001;
    server_name $SERVER_IP;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    
    # Handle preflight requests
    location / {
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Static files
    location /_next/static/ {
        alias /var/www/car-salon/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /static/ {
        alias /var/www/car-salon/public/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /img/ {
        alias /var/www/car-salon/public/img/;
        expires 1M;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /favicon.ico {
        alias /var/www/car-salon/public/favicon.ico;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API Proxy - This is the key fix!
    location /api/ {
        proxy_pass http://$SERVER_IP:$API_PORT/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # GraphQL Proxy - This is the key fix!
    location /graphql {
        proxy_pass http://$SERVER_IP:$API_PORT/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
        
        # CORS headers for GraphQL
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
    }
    
    # WebSocket support for real-time features
    location /ws {
        proxy_pass http://$SERVER_IP:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # Main application
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }
}
EOF

# Create fixed environment configuration
print_status "Creating fixed environment configuration..."

cat > .env.fixed << EOF
# Fixed Environment Configuration for Car Salon
# Using relative paths so nginx can proxy them properly

# API URLs - Use relative paths for nginx proxy
REACT_APP_API_URL=http://$SERVER_IP:$FRONTEND_PORT/api
REACT_APP_API_GRAPHQL_URL=http://$SERVER_IP:$FRONTEND_PORT/graphql
REACT_APP_API_WS=ws://$SERVER_IP:$FRONTEND_PORT/ws

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:$FRONTEND_PORT
PORT=$FRONTEND_PORT

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=http://$SERVER_IP:$FRONTEND_PORT
EOF

# Create deployment script for the fix
print_status "Creating deployment script for the fix..."

cat > deploy-backend-fix.sh << EOF
#!/bin/bash

# Deploy Backend Connection Fix to Server
set -e

echo "🔧 Deploying backend connection fix to server..."

# Upload fixed files
scp nginx-car-salon-fixed.conf root@$SERVER_IP:/tmp/
scp .env.fixed root@$SERVER_IP:/tmp/

# Apply fixes on server
ssh root@$SERVER_IP << 'EOF'
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
echo "   Frontend: http://$SERVER_IP:$FRONTEND_PORT"
echo "   API: http://$SERVER_IP:$FRONTEND_PORT/api"
echo "   GraphQL: http://$SERVER_IP:$FRONTEND_PORT/graphql"
echo ""
echo "🔍 Check if data is loading now!"
EOF

echo "✅ Backend connection fix ready!"

chmod +x deploy-backend-fix.sh

print_header "Backend Connection Fix Ready!"

echo "🎉 I've created a fix for your backend connection issues!"
echo ""
echo "📋 The problem was:"
echo "   ❌ Car Salon was trying to connect directly to port 4001"
echo "   ❌ Nginx wasn't proxying API calls properly"
echo "   ❌ CORS headers were missing"
echo ""
echo "✅ The fix includes:"
echo "   ✅ Proper nginx API proxy configuration"
echo "   ✅ CORS headers for cross-origin requests"
echo "   ✅ GraphQL endpoint proxy"
echo "   ✅ WebSocket support"
echo "   ✅ Updated environment variables"
echo ""
echo "🚀 To apply the fix:"
echo "   1. Run: ./deploy-backend-fix.sh"
echo "   2. Test your Car Salon at: http://$SERVER_IP:$FRONTEND_PORT"
echo ""
echo "🔍 The fix will make your Car Salon connect to:"
echo "   Frontend: http://$SERVER_IP:$FRONTEND_PORT"
echo "   API: http://$SERVER_IP:$FRONTEND_PORT/api (proxied to port 4001)"
echo "   GraphQL: http://$SERVER_IP:$FRONTEND_PORT/graphql (proxied to port 4001)"
echo ""
echo "📚 This way, all requests go through nginx on port 3001,"
echo "   and nginx properly forwards API calls to your backend on port 4001."

print_status "🔧 Backend connection fix is ready to deploy!"
