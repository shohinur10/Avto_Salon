# Car Salon Deployment Instructions

## Quick Deployment

1. Upload this package to your server:
   ```bash
   scp -r deployment-package/ root@72.60.108.222:/tmp/
   ```

2. On your server, run:
   ```bash
   sudo mv /tmp/deployment-package /var/www/car-salon
   cd /var/www/car-salon
   chmod +x *.sh
   ```

3. Install and start services:
   ```bash
   sudo ./install-systemd-services.sh
   ```

4. Configure nginx:
   ```bash
   sudo cp nginx-car-salon.conf /etc/nginx/sites-available/car-salon
   sudo ln -s /etc/nginx/sites-available/car-salon /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Access Your Application

- Car Salon: http://72.60.108.222:3001
- Furniture Project: http://72.60.108.222 (unchanged)

## Management Commands

- Check status: `sudo systemctl status avto-salon`
- View logs: `sudo journalctl -u avto-salon -f`
- Restart: `sudo systemctl restart avto-salon`
