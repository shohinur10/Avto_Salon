#!/bin/bash

# Quick Server Setup Script for Car Salon
# This script sets up a server for running the Car Salon application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Run as a regular user with sudo privileges."
    exit 1
fi

print_header "Car Salon Server Setup"

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully!"
else
    print_status "Docker is already installed."
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully!"
else
    print_status "Docker Compose is already installed."
fi

# Install Node.js (for manual deployment option)
print_status "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_status "Node.js installed successfully!"
else
    print_status "Node.js is already installed."
fi

# Install PM2 (for manual deployment)
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_status "PM2 installed successfully!"
else
    print_status "PM2 is already installed."
fi

# Install Nginx (for reverse proxy and SSL)
print_status "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    print_status "Nginx installed and started!"
else
    print_status "Nginx is already installed."
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3001/tcp  # Frontend
sudo ufw allow 4001/tcp  # API
sudo ufw --force enable

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /var/www/avto-salon
sudo chown $USER:$USER /var/www/avto-salon

print_header "Server Setup Complete!"

echo "🎉 Your server is now ready for Car Salon deployment!"
echo ""
echo "📋 What was installed:"
echo "✅ Docker & Docker Compose"
echo "✅ Node.js 18+"
echo "✅ PM2 (Process Manager)"
echo "✅ Nginx (Web Server)"
echo "✅ Firewall configured"
echo ""
echo "📋 Next steps:"
echo "1. Upload your Car Salon code to /var/www/avto-salon"
echo "2. Run ./deploy-production.sh from your project directory"
echo "3. Configure your domain (optional)"
echo "4. Set up SSL certificates (optional)"
echo ""
echo "🔧 Useful commands:"
echo "- Check Docker: docker --version"
echo "- Check Node.js: node --version"
echo "- Check PM2: pm2 --version"
echo "- Check Nginx: sudo systemctl status nginx"
echo ""
echo "⚠️  Important: You need to log out and back in for Docker group changes to take effect."
echo ""
echo "📚 For detailed deployment instructions, see: SERVER_DEPLOYMENT_GUIDE.md"

print_status "🚀 Server setup completed successfully!"
