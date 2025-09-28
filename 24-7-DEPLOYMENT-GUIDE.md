# 🚀 Car Salon 24/7 Deployment Guide

## Overview

This guide will help you deploy your Car Salon application to run continuously 24 hours a day, 7 days a week, just like your furniture projects. The setup includes automatic restarts, health monitoring, backups, and system maintenance.

## 🎯 What You'll Get

- ✅ **Automatic startup** on server boot
- ✅ **Auto-restart** on failures (up to 5 attempts)
- ✅ **Health monitoring** every 30 seconds
- ✅ **Daily backups** with 30-day retention
- ✅ **System maintenance** and cleanup
- ✅ **Email notifications** for issues
- ✅ **Resource monitoring** (CPU, Memory, Disk)
- ✅ **Log rotation** and management

## 📋 Prerequisites

- Ubuntu/Debian server (18.04+)
- Root or sudo access
- Domain name (optional, for SSL)
- Email address for notifications

## 🚀 Quick Setup (5 Minutes)

### Step 1: Prepare Your Server

```bash
# Update your server
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common
```

### Step 2: Upload Your Application

```bash
# Upload your Car Salon code to the server
scp -r /path/to/your/avto-salon user@your-server-ip:/tmp/

# On your server, move to the correct location
sudo mv /tmp/avto-salon /var/www/
sudo chown -R $USER:$USER /var/www/avto-salon
```

### Step 3: Install 24/7 Services

```bash
# Navigate to your application directory
cd /var/www/avto-salon

# Make scripts executable
chmod +x *.sh
chmod +x systemd/*.sh

# Install and start 24/7 services
sudo ./install-systemd-services.sh
```

### Step 4: Verify Installation

```bash
# Check service status
sudo systemctl status avto-salon
sudo systemctl status avto-salon-monitor
sudo systemctl status avto-salon-backup.timer

# View logs
sudo journalctl -u avto-salon -f
```

## 🌐 Access Your Application

After installation, your Car Salon will be available at:
- **Frontend**: `http://your-server-ip:3000`
- **Nginx**: `http://your-server-ip` (port 80)

## 🔧 Configuration

### Environment Variables

Edit `/var/www/avto-salon/.env` to configure your application:

```bash
# Production Environment Configuration
REACT_APP_API_URL=http://72.60.108.222:4001
REACT_APP_API_GRAPHQL_URL=http://72.60.108.222:4001/graphql
REACT_APP_API_WS=ws://72.60.108.222:4001

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://your-domain.com
```

### Email Notifications

Update email addresses in these files:
- `/var/www/avto-salon/monitor-health.sh` (line 12)
- `/var/www/avto-salon/backup-and-cleanup.sh` (line 12)

```bash
ALERT_EMAIL="your-email@domain.com"
NOTIFICATION_EMAIL="your-email@domain.com"
```

### Health Check Settings

Modify monitoring intervals in `/var/www/avto-salon/monitor-health.sh`:

```bash
HEALTH_CHECK_INTERVAL=30  # seconds between checks
MAX_RESTART_ATTEMPTS=5    # max restart attempts
RESTART_DELAY=10          # seconds to wait before restart
```

## 📊 Monitoring & Management

### Service Management Commands

```bash
# Check all services
sudo systemctl status avto-salon avto-salon-monitor avto-salon-backup.timer

# Start/Stop/Restart services
sudo systemctl start avto-salon
sudo systemctl stop avto-salon
sudo systemctl restart avto-salon

# View real-time logs
sudo journalctl -u avto-salon -f
sudo journalctl -u avto-salon-monitor -f
sudo journalctl -u avto-salon-backup -f

# Check service health
curl http://localhost:3000
curl http://localhost
```

### Backup Management

```bash
# View backup directory
ls -la /var/backups/avto-salon/

# Manual backup
sudo systemctl start avto-salon-backup

# Restore from backup
cd /var/www/avto-salon
tar -xzf /var/backups/avto-salon/app-backup-YYYYMMDD-HHMMSS.tar.gz
```

### Log Management

```bash
# View application logs
tail -f /var/log/avto-salon/health-monitor.log
tail -f /var/log/avto-salon/backup.log

# View system logs
sudo journalctl -u avto-salon --since "1 hour ago"
```

## 🔒 Security & SSL Setup

### Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Frontend (if needed)
sudo ufw enable
```

### SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already configured)
sudo systemctl status certbot.timer
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Service Won't Start

```bash
# Check service status
sudo systemctl status avto-salon

# View detailed logs
sudo journalctl -u avto-salon -n 50

# Check application directory permissions
ls -la /var/www/avto-salon/
```

#### 2. Health Checks Failing

```bash
# Check if ports are in use
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80

# Test connectivity manually
curl -v http://localhost:3000
curl -v http://localhost
```

#### 3. Backend Connection Issues

```bash
# Test backend connectivity
curl -v http://72.60.108.222:4001
curl -v -X POST -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}' \
  http://72.60.108.222:4001/graphql
```

#### 4. High Resource Usage

```bash
# Check system resources
htop
df -h
free -h

# Check application logs for errors
sudo journalctl -u avto-salon --since "1 hour ago" | grep -i error
```

### Recovery Procedures

#### Complete Service Restart

```bash
# Stop all services
sudo systemctl stop avto-salon avto-salon-monitor

# Clean up any stuck processes
sudo pkill -f "next start" || true
sudo pkill -f "node" || true

# Restart services
sudo systemctl start avto-salon avto-salon-monitor
```

#### Restore from Backup

```bash
# Stop services
sudo systemctl stop avto-salon

# Restore application
cd /var/www/avto-salon
tar -xzf /var/backups/avto-salon/app-backup-YYYYMMDD-HHMMSS.tar.gz

# Restart services
sudo systemctl start avto-salon
```

## 📈 Performance Optimization

### System Optimization

```bash
# Increase file limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize kernel parameters
echo "net.core.somaxconn = 65536" | sudo tee -a /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65536" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Application Optimization

```bash
# Enable gzip compression in nginx
sudo nano /etc/nginx/nginx.conf

# Add to http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## 📊 Monitoring Dashboard

### Create a Simple Status Page

Create `/var/www/avto-salon/public/status.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Car Salon Status</title>
    <meta http-equiv="refresh" content="30">
</head>
<body>
    <h1>Car Salon Status</h1>
    <p>Last Updated: <span id="timestamp"></span></p>
    <div id="status">Loading...</div>
    
    <script>
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
        
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                document.getElementById('status').innerHTML = 
                    `<p>Frontend: ${data.frontend ? '✅' : '❌'}</p>
                     <p>Backend: ${data.backend ? '✅' : '❌'}</p>
                     <p>Database: ${data.database ? '✅' : '❌'}</p>`;
            })
            .catch(() => {
                document.getElementById('status').innerHTML = '❌ Status check failed';
            });
    </script>
</body>
</html>
```

## 🎉 Success Checklist

After deployment, verify:

- [ ] Application loads at `http://your-server-ip:3000`
- [ ] Nginx proxy works at `http://your-server-ip`
- [ ] Services start automatically on boot
- [ ] Health monitoring is active
- [ ] Daily backups are running
- [ ] Email notifications work
- [ ] Logs are being generated
- [ ] System resources are normal

## 📞 Support

If you encounter issues:

1. Check the logs: `sudo journalctl -u avto-salon -f`
2. Verify service status: `sudo systemctl status avto-salon`
3. Test connectivity: `curl http://localhost:3000`
4. Check system resources: `htop`, `df -h`, `free -h`

## 🔄 Updates & Maintenance

### Application Updates

```bash
# Stop services
sudo systemctl stop avto-salon

# Update application code
cd /var/www/avto-salon
git pull origin main  # or upload new code

# Install new dependencies
npm install --production

# Restart services
sudo systemctl start avto-salon
```

### System Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Restart services after system updates
sudo systemctl restart avto-salon avto-salon-monitor
```

---

## 🎯 Your Car Salon is Now Running 24/7!

Your application will now:
- ✅ Start automatically when the server boots
- ✅ Restart automatically if it crashes
- ✅ Monitor its own health continuously
- ✅ Create daily backups
- ✅ Clean up old files automatically
- ✅ Send you notifications if something goes wrong

Just like your furniture projects, your Car Salon will run reliably 24 hours a day, 7 days a week! 🚗✨


