#!/bin/bash

# Avto Salon Development Startup Script
echo "🚀 Starting Avto Salon Development Environment..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start mock backend
echo "📡 Starting mock backend server on port 3005..."
node mock-backend.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Check if backend is running
if curl -s http://localhost:3005/health > /dev/null; then
    echo "✅ Mock backend is running on http://localhost:3005"
else
    echo "❌ Failed to start mock backend"
    exit 1
fi

# Start Next.js frontend
echo "🌐 Starting Next.js frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Next.js frontend is running on http://localhost:3000"
else
    echo "❌ Failed to start Next.js frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Check if nginx is running
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Nginx proxy is running on http://localhost:8080"
    echo ""
    echo "🎉 Development environment is ready!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 Nginx Proxy: http://localhost:8080"
    echo "📡 Backend API: http://localhost:3005"
    echo "📊 GraphQL: http://localhost:3005/graphql"
    echo "❤️  Health Check: http://localhost:3005/health"
    echo ""
    echo "Press Ctrl+C to stop all servers"
else
    echo "⚠️  Nginx is not running. Please start it with: brew services start nginx"
fi

# Wait for user to stop
wait


