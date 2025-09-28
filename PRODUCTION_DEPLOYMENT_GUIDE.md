# 🚀 Production Deployment Guide

## Overview
This guide will help you deploy your Car Salon website to production with proper SSL, nginx configuration, and Docker containerization.

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2 cores minimum
- **Domain**: A registered domain name pointing to your server

### Software Requirements
- Docker & Docker Compose
- Nginx
- Node.js 18+ (if not using Docker)
- Git

## Step-by-Step Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Domain Configuration

1. **DNS Setup**: Point your domain to your server's IP address
   ```
   A Record: yourdomain.com → YOUR_SERVER_IP
   CNAME: www.yourdomain.com → yourdomain.com
   ```

2. **Verify DNS**: Wait for DNS propagation (can take up to 24 hours)
   ```bash
   nslookup yourdomain.com
   ```

### 3. SSL Certificate Setup

```bash
# Run the SSL setup script
sudo ./setup-ssl.sh
```

Or manually:
```bash
# Stop nginx
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Configure nginx with SSL
sudo cp nginx.conf /etc/nginx/sites-available/yourdomain.com
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Application Deployment

#### Option A: Docker Deployment (Recommended)

```bash
# Build production version
./build-production.sh

# Upload to server
scp avto-salon-production-*.tar.gz user@yourdomain.com:/home/user/

# On server, extract and deploy
tar -xzf avto-salon-production-*.tar.gz
cd production-build

# Update environment variables
nano .env.production

# Deploy with Docker
docker-compose -f docker-compose.production.yml up -d
```

#### Option B: Manual Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/avto-salon.git
cd avto-salon

# Install dependencies
yarn install

# Build application
yarn build

# Start with PM2
npm install -g pm2
pm2 start npm --name "avto-salon" -- start
pm2 save
pm2 startup
```

### 5. Environment Configuration

Update `.env.production`:
```bash
# API Configuration
REACT_APP_API_URL=https://yourdomain.com
REACT_APP_API_GRAPHQL_URL=https://yourdomain.com/graphql
REACT_APP_API_WS=wss://yourdomain.com

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 6. Backend Configuration

Ensure your backend is configured for production:

```bash
# Backend environment variables
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-secure-jwt-secret
CORS_ORIGIN=https://yourdomain.com
```

### 7. Database Setup

#### PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE avto_salon;
CREATE USER avto_salon_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE avto_salon TO avto_salon_user;
\q
```

#### MongoDB Alternative
```bash
# Install MongoDB
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 8. Monitoring and Logging

#### Set up monitoring with PM2 (if not using Docker)
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

#### Set up log rotation
```bash
sudo nano /etc/logrotate.d/avto-salon
```

Add:
```
/var/log/avto-salon/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 9. Security Hardening

#### Firewall Configuration
```bash
# Enable UFW
sudo ufw enable

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3000/tcp   # Block direct access to app
sudo ufw deny 4001/tcp   # Block direct access to API
```

#### SSL Security
```bash
# Test SSL configuration
curl -I https://yourdomain.com

# Check SSL rating
# Visit: https://www.ssllabs.com/ssltest/
```

### 10. Performance Optimization

#### Nginx Optimization
```bash
# Edit nginx.conf
sudo nano /etc/nginx/nginx.conf
```

Add to `http` block:
```nginx
# Performance optimizations
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 10M;

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### Application Optimization
```bash
# Enable Next.js optimizations in next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}
```

## Maintenance

### Regular Tasks

#### Daily
- Monitor server resources (CPU, RAM, Disk)
- Check application logs for errors
- Verify SSL certificate status

#### Weekly
- Update system packages
- Review security logs
- Backup database

#### Monthly
- Update application dependencies
- Review and rotate logs
- Performance analysis

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
pg_dump -h localhost -U avto_salon_user avto_salon > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/avto-salon/
```

### Troubleshooting

#### Common Issues

1. **SSL Certificate Issues**
   ```bash
   sudo certbot renew --dry-run
   sudo systemctl reload nginx
   ```

2. **Application Not Starting**
   ```bash
   docker-compose logs avto-salon-frontend
   pm2 logs avto-salon
   ```

3. **Database Connection Issues**
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -c "SELECT 1;"
   ```

4. **Nginx Configuration Issues**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## Performance Monitoring

### Tools to Use
- **Server Monitoring**: htop, iotop, netstat
- **Application Monitoring**: PM2 monitoring, Docker stats
- **Web Performance**: Google PageSpeed Insights, GTmetrix
- **SSL Monitoring**: SSL Labs SSL Test

### Key Metrics to Monitor
- Response time < 200ms
- Uptime > 99.9%
- SSL grade A+
- Page load time < 3 seconds

## Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (only 22, 80, 443 open)
- [ ] Strong passwords for all services
- [ ] Regular security updates
- [ ] Database access restricted
- [ ] Application logs monitored
- [ ] Backup strategy implemented
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Rate limiting configured

## Support

For issues or questions:
1. Check application logs
2. Review nginx error logs
3. Verify DNS configuration
4. Test SSL certificate status
5. Check server resources

---

**🎉 Congratulations! Your Car Salon website is now running in production with enterprise-grade security and performance optimizations.**







