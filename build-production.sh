#!/bin/bash

# Production Build Script for Car Salon Website
# This script builds and prepares the application for production deployment

set -e

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf dist

# Install dependencies
print_status "Installing dependencies..."
yarn install --frozen-lockfile

# Run linting
print_status "Running linting..."
yarn lint

# Run type checking
print_status "Running type checking..."
yarn type-check || print_warning "Type checking failed, continuing..."

# Build the application
print_status "Building application for production..."
NODE_ENV=production yarn build

# Optimize images (if you have next-optimized-images)
if [ -f "next.config.js" ] && grep -q "optimized-images" next.config.js; then
    print_status "Optimizing images..."
    yarn optimize-images
fi

# Generate sitemap
print_status "Generating sitemap..."
yarn generate-sitemap || print_warning "Sitemap generation failed, continuing..."

# Run security audit
print_status "Running security audit..."
yarn audit --audit-level moderate || print_warning "Security audit found issues, please review"

# Create production directory
print_status "Creating production directory..."
mkdir -p production-build

# Copy necessary files
print_status "Copying production files..."
cp -r .next production-build/
cp -r public production-build/
cp -r package.json production-build/
cp -r yarn.lock production-build/
cp -r next.config.js production-build/
cp -r Dockerfile.production production-build/
cp -r docker-compose.production.yml production-build/
cp -r nginx.conf production-build/

# Create production environment file
print_status "Creating production environment file..."
if [ ! -f ".env.production" ]; then
    print_warning ".env.production not found, creating from example..."
    cp env.production.example .env.production
    print_warning "Please update .env.production with your actual production values!"
fi

# Set proper permissions
print_status "Setting proper permissions..."
chmod -R 755 production-build/
chmod +x production-build/Dockerfile.production

# Create deployment archive
print_status "Creating deployment archive..."
tar -czf avto-salon-production-$(date +%Y%m%d-%H%M%S).tar.gz production-build/

print_status "✅ Production build completed successfully!"
print_status "📦 Build artifacts created in: production-build/"
print_status "🗜️  Archive created: avto-salon-production-*.tar.gz"

echo ""
print_status "Next steps:"
echo "1. Upload the archive to your production server"
echo "2. Extract the archive on your server"
echo "3. Update .env.production with your actual values"
echo "4. Run: docker-compose -f docker-compose.production.yml up -d"
echo "5. Configure SSL certificates with Let's Encrypt"
echo "6. Update DNS records to point to your server"

print_status "🎉 Ready for production deployment!"







