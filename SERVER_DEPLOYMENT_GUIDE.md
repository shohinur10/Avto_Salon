# Car Salon Server Deployment Guide

This guide will help you deploy your Car Salon website to a server instead of running it locally.

## Prerequisites

- A server with Ubuntu/CentOS (recommended)
- Docker installed (for Docker deployment)
- Node.js 18+ installed (for manual deployment)
- Domain name (optional, for SSL)

## Quick Start

1. **Run the deployment script:**
   ```bash
   ./deploy-production.sh
   ```

2. **Follow the prompts to enter your server details**

3. **Choose your deployment method (Docker recommended)**

## Manual Deployment Steps

### 1. Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker (if using Docker deployment)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Node.js (if using manual deployment)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Upload Your Code

```bash
# Upload your project to the server
scp -r /path/to/Avto_Salon user@your-server-ip:/home/user/

# Or use git
git clone your-repository-url
cd Avto_Salon
```

### 3. Configure Environment

Create `.env.production` file:
```bash
# Production Environment Configuration
REACT_APP_API_URL=http://YOUR_SERVER_IP:4001
REACT_APP_API_GRAPHQL_URL=http://YOUR_SERVER_IP:4001/graphql
REACT_APP_API_WS=ws://YOUR_SERVER_IP:4001

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://YOUR_SERVER_IP:3001

# Security
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://YOUR_SERVER_IP:3001
```

### 4. Deploy with Docker (Recommended)

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Deploy Manually with PM2

```bash
# Install PM2
npm install -g pm2

# Build the application
npm run build:production

# Start with PM2
pm2 start npm --name "avto-salon" -- start:production
pm2 save
pm2 startup
```

## Configuration Details

### Docker Configuration

The `docker-compose.prod.yml` file contains:
- Frontend service on port 3001
- Environment variables for API connection
- Network configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://72.60.108.222:4001` |
| `REACT_APP_API_GRAPHQL_URL` | GraphQL endpoint | `http://72.60.108.222:4001/graphql` |
| `REACT_APP_API_WS` | WebSocket URL | `ws://72.60.108.222:4001` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://72.60.108.222:3001` |

## SSL Setup (Optional)

For production with HTTPS:

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Update environment variables to use HTTPS:**
   ```bash
   REACT_APP_API_URL=https://yourdomain.com
   REACT_APP_API_GRAPHQL_URL=https://yourdomain.com/graphql
   REACT_APP_API_WS=wss://yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3001
   
   # Kill the process
   sudo kill -9 PID
   ```

2. **Docker permission denied:**
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

3. **Build fails:**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm run build:production
   ```

### Logs and Monitoring

**Docker:**
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

**PM2:**
```bash
# View logs
pm2 logs avto-salon

# Restart
pm2 restart avto-salon

# Monitor
pm2 monit
```

## Security Considerations

1. **Change default secrets** in `.env.production`
2. **Use HTTPS** in production
3. **Configure firewall** to only allow necessary ports
4. **Regular updates** of dependencies
5. **Backup** your data regularly

## Performance Optimization

1. **Enable gzip compression** in nginx
2. **Use CDN** for static assets
3. **Configure caching** headers
4. **Monitor** server resources

## Backup and Maintenance

### Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz /path/to/your/app
```

### Update Process
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

## Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity

For additional help, refer to the project documentation or create an issue in the repository.
