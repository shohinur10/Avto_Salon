#!/bin/bash

# Quick Production Deployment Script
# This script provides a simple way to deploy your application

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "Car Salon Production Deployment"

# Get deployment method
echo "Select deployment method:"
echo "1) Docker (Recommended)"
echo "2) Manual (PM2)"
echo "3) Build only"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Deploying with Docker..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            print_error "Docker is not installed. Please install Docker first."
            exit 1
        fi
        
        # Build and deploy with Docker
        print_status "Building Docker image..."
        docker build -f Dockerfile.production -t avto-salon:latest .
        
        print_status "Starting containers..."
        docker-compose -f docker-compose.production.yml up -d
        
        print_status "Checking container status..."
        docker-compose -f docker-compose.production.yml ps
        
        print_status "✅ Docker deployment completed!"
        ;;
        
    2)
        print_status "Deploying manually with PM2..."
        
        # Check if PM2 is installed
        if ! command -v pm2 &> /dev/null; then
            print_status "Installing PM2..."
            npm install -g pm2
        fi
        
        # Build application
        print_status "Building application..."
        yarn build:production
        
        # Start with PM2
        print_status "Starting application with PM2..."
        pm2 delete avto-salon 2>/dev/null || true
        pm2 start npm --name "avto-salon" -- start:production
        pm2 save
        pm2 startup
        
        print_status "✅ Manual deployment completed!"
        ;;
        
    3)
        print_status "Building for production..."
        yarn build:production
        print_status "✅ Build completed! Ready for deployment."
        ;;
        
    *)
        print_error "Invalid choice. Please select 1, 2, or 3."
        exit 1
        ;;
esac

print_header "Deployment Summary"

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your domain DNS to point to this server"
echo "2. Configure SSL certificates (run ./setup-ssl.sh)"
echo "3. Test your website at your domain"
echo "4. Set up monitoring and backups"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs -f (Docker) or pm2 logs (PM2)"
echo "- Restart: docker-compose restart (Docker) or pm2 restart avto-salon (PM2)"
echo "- Stop: docker-compose down (Docker) or pm2 stop avto-salon (PM2)"
echo ""
echo "📚 For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md"

print_status "🚀 Your Car Salon website is now live!"