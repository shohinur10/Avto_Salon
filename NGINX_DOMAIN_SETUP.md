# Avto_Salon Domain Setup Guide

## Current Status ✅
- ✅ Nginx installed and running on port 8080
- ✅ Configuration file created: `/usr/local/etc/nginx/servers/Avto_salon.conf`
- ✅ Nginx service started successfully

## Next Steps for Domain Setup

### 1. Start Your Next.js Application
```bash
# In your project directory
cd /Users/shohinur/Desktop/Avto_Salon
npm run dev
# or
yarn dev
```

### 2. Test Current Setup
```bash
# Test nginx (should return 200 OK)
curl -I http://localhost:8080

# Test Next.js app (should return your app)
curl -I http://localhost:3000
```

### 3. Domain Configuration Options

#### Option A: Local Development (avtosalon.local)
1. **Edit your hosts file:**
   ```bash
   sudo nano /etc/hosts
   ```
   
2. **Add this line:**
   ```
   127.0.0.1 avtosalon.local
   ```

3. **Update nginx config:**
   ```bash
   sudo nano /usr/local/etc/nginx/servers/Avto_salon.conf
   ```
   Change `server_name` to your domain:
   ```
   server_name avtosalon.local www.avtosalon.local;
   ```

4. **Reload nginx:**
   ```bash
   brew services restart nginx
   ```

5. **Test:**
   ```bash
   curl -I http://avtosalon.local:8080
   ```

#### Option B: Real Domain (Production)
1. **Register a domain** (e.g., avtosalon.com)
2. **Point DNS A records** to your server's IP
3. **Update nginx config:**
   ```bash
   sudo nano /usr/local/etc/nginx/servers/Avto_salon.conf
   ```
   Change `server_name` to:
   ```
   server_name avtosalon.com www.avtosalon.com;
   ```

4. **Set up SSL (Let's Encrypt):**
   ```bash
   # Install certbot
   brew install certbot
   
   # Get SSL certificate
   sudo certbot --nginx -d avtosalon.com -d www.avtosalon.com
   ```

### 4. Nginx Management Commands

```bash
# Check nginx status
brew services list | grep nginx

# Start nginx
brew services start nginx

# Stop nginx
brew services stop nginx

# Restart nginx
brew services restart nginx

# Test configuration
nginx -t

# Reload configuration (without stopping)
nginx -s reload
```

### 5. Configuration File Location
- **Main config:** `/usr/local/etc/nginx/nginx.conf`
- **Your site config:** `/usr/local/etc/nginx/servers/Avto_salon.conf`

### 6. Logs
```bash
# Access logs
tail -f /usr/local/var/log/nginx/access.log

# Error logs
tail -f /usr/local/var/log/nginx/error.log
```

### 7. Current Configuration Features
- ✅ Reverse proxy to Next.js (port 3000)
- ✅ Static file caching
- ✅ Gzip compression
- ✅ Security headers
- ✅ API route handling
- ✅ Admin route handling
- ✅ Health check endpoint

### 8. Next Steps for Production
1. **Set up SSL certificates**
2. **Configure firewall**
3. **Set up monitoring**
4. **Configure backup**
5. **Set up CDN (optional)**

## Testing Your Setup

1. **Start Next.js:**
   ```bash
   npm run dev
   ```

2. **Test nginx proxy:**
   ```bash
   curl -I http://localhost:8080
   ```

3. **Test with domain (after hosts file setup):**
   ```bash
   curl -I http://avtosalon.local:8080
   ```

## Troubleshooting

### If nginx won't start:
```bash
# Check configuration
nginx -t

# Check if port 8080 is in use
lsof -i :8080

# Check nginx logs
tail -f /usr/local/var/log/nginx/error.log
```

### If Next.js won't start:
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

## Security Notes
- The current config includes basic security headers
- For production, enable HTTPS and additional security measures
- Consider implementing rate limiting and DDoS protection
- Regular security updates are recommended

---

**Your nginx is ready!** 🚀
Start your Next.js app and test the setup with the commands above.
