#!/bin/bash

# Deploy Car Salon to Existing Server (72.60.108.222)
# This script deploys Car Salon alongside your existing furniture project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server configuration
SERVER_IP="72.60.108.222"
SERVER_USER="root"  # Change this to your server username
FRONTEND_PORT="3001"  # Different port to avoid conflict with furniture project
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "Deploying Car Salon to Existing Server"

# Get server credentials
echo "Enter your server details:"
read -p "Server username (default: root): " input_user
SERVER_USER=${input_user:-root}

read -p "SSH key path (optional): " ssh_key_path

# Build the application
print_status "Building Car Salon application..."
npm run build

# Create deployment package
print_status "Creating deployment package..."
rm -rf deployment-package
mkdir -p deployment-package

# Copy necessary files
cp -r .next deployment-package/
cp -r public deployment-package/
cp package.json deployment-package/
cp next.config.js deployment-package/
cp -r systemd deployment-package/
cp start-24-7-server.sh deployment-package/
cp monitor-health.sh deployment-package/
cp backup-and-cleanup.sh deployment-package/
cp install-systemd-services.sh deployment-package/

# Create production environment file
cat > deployment-package/.env << EOF
# Production Environment Configuration
REACT_APP_API_URL=http://$SERVER_IP:$API_PORT
REACT_APP_API_GRAPHQL_URL=http://$SERVER_IP:$API_PORT/graphql
REACT_APP_API_WS=ws://$SERVER_IP:$API_PORT

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:$FRONTEND_PORT
PORT=$FRONTEND_PORT
EOF

# Create nginx configuration for Car Salon
cat > deployment-package/nginx-car-salon.conf << EOF
# Nginx configuration for Car Salon (Port 3001)
server {
    listen 3001;
    server_name $SERVER_IP;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
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
    }
    
    location /static/ {
        alias /var/www/car-salon/public/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /img/ {
        alias /var/www/car-salon/public/img/;
        expires 1M;
        add_header Cache-Control "public";
    }
    
    location /favicon.ico {
        alias /var/www/car-salon/public/favicon.ico;
        expires 1y;
        add_header Cache-Control "public, immutable";
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

# Create startup script for the server
cat > deployment-package/start-car-salon.sh << EOF
#!/bin/bash

# Car Salon Startup Script for Server
echo "🚗 Starting Car Salon on port $FRONTEND_PORT..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Start the application
echo "🌟 Starting Car Salon on port $FRONTEND_PORT..."
PORT=$FRONTEND_PORT npm start
EOF

chmod +x deployment-package/start-car-salon.sh

# Create deployment instructions
cat > deployment-package/DEPLOYMENT_INSTRUCTIONS.md << EOF
# Car Salon Deployment Instructions

## Quick Deployment

1. Upload this package to your server:
   \`\`\`bash
   scp -r deployment-package/ $SERVER_USER@$SERVER_IP:/tmp/
   \`\`\`

2. On your server, run:
   \`\`\`bash
   sudo mv /tmp/deployment-package /var/www/car-salon
   cd /var/www/car-salon
   chmod +x *.sh
   \`\`\`

3. Install and start services:
   \`\`\`bash
   sudo ./install-systemd-services.sh
   \`\`\`

4. Configure nginx:
   \`\`\`bash
   sudo cp nginx-car-salon.conf /etc/nginx/sites-available/car-salon
   sudo ln -s /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   \`\`\`

## Access Your Application

- Car Salon: http://$SERVER_IP:$FRONTEND_PORT
- Furniture Project: http://$SERVER_IP (unchanged)

## Management Commands

- Check status: \`sudo systemctl status avto-salon\`
- View logs: \`sudo journalctl -u avto-salon -f\`
- Restart: \`sudo systemctl restart avto-salon\`
EOF

# Create archive
print_status "Creating deployment archive..."
tar -czf car-salon-deployment.tar.gz deployment-package/

print_header "Deployment Package Ready!"

echo "🎉 Car Salon deployment package created successfully!"
echo ""
echo "📦 Package: car-salon-deployment.tar.gz"
echo "📁 Contents: deployment-package/"
echo ""
echo "📋 Next steps:"
echo "1. Upload the package to your server:"
echo "   scp car-salon-deployment.tar.gz $SERVER_USER@$SERVER_IP:/tmp/"
echo ""
echo "2. SSH into your server:"
echo "   ssh $SERVER_USER@$SERVER_IP"
echo ""
echo "3. Extract and deploy:"
echo "   cd /tmp"
echo "   tar -xzf car-salon-deployment.tar.gz"
echo "   sudo mv deployment-package /var/www/car-salon"
echo "   cd /var/www/car-salon"
echo "   chmod +x *.sh"
echo "   sudo ./install-systemd-services.sh"
echo ""
echo "4. Configure nginx:"
echo "   sudo cp nginx-car-salon.conf /etc/nginx/sites-available/car-salon"
echo "   sudo ln -s /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "🌐 After deployment:"
echo "   Car Salon: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Furniture Project: http://$SERVER_IP (unchanged)"
echo ""
echo "📚 Detailed instructions are in deployment-package/DEPLOYMENT_INSTRUCTIONS.md"

print_status "🚀 Ready to deploy to your server!"


