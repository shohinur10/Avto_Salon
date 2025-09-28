#!/bin/bash

# SSL Certificate Setup Script
# This script sets up SSL certificates using Let's Encrypt for your domain

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root (use sudo)"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
read -p "Enter your email for Let's Encrypt: " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    print_error "Domain and email are required!"
    exit 1
fi

print_status "Setting up SSL for domain: $DOMAIN"

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y nginx certbot python3-certbot-nginx

# Stop nginx temporarily
print_status "Stopping nginx..."
systemctl stop nginx

# Create temporary nginx config for certificate generation
print_status "Creating temporary nginx configuration..."
cat > /etc/nginx/sites-available/temp-ssl << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location / {
        return 200 'OK';
        add_header Content-Type text/plain;
    }
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
}
EOF

# Enable temporary config
ln -sf /etc/nginx/sites-available/temp-ssl /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Start nginx
print_status "Starting nginx with temporary configuration..."
systemctl start nginx

# Obtain SSL certificate
print_status "Obtaining SSL certificate from Let's Encrypt..."
certbot certonly --webroot -w /var/www/html -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Update nginx configuration with SSL
print_status "Updating nginx configuration with SSL..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /graphql {
        proxy_pass http://localhost:4001/graphql;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the new configuration
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/temp-ssl

# Test nginx configuration
print_status "Testing nginx configuration..."
nginx -t

# Reload nginx
print_status "Reloading nginx..."
systemctl reload nginx

# Set up automatic certificate renewal
print_status "Setting up automatic certificate renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

print_status "✅ SSL setup completed successfully!"
print_status "🔒 Your website is now accessible at: https://$DOMAIN"
print_status "🔄 SSL certificates will auto-renew via cron job"

print_warning "Next steps:"
echo "1. Update your DNS records to point to this server"
echo "2. Deploy your application using the production build script"
echo "3. Test your website at https://$DOMAIN"







