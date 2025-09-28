#!/bin/bash

# Car Salon Startup Script for Server
echo "🚗 Starting Car Salon on port 3001..."

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
echo "🌟 Starting Car Salon on port 3001..."
PORT=3001 npm start
