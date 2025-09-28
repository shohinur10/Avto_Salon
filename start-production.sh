#!/bin/bash

# Avto Salon Production Development Script
echo "🚀 Starting Avto Salon with Production Backend..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if production backend is accessible
echo "📡 Checking production backend server..."
if curl -s http://72.60.108.222:4001 > /dev/null; then
    echo "✅ Production backend is accessible at http://72.60.108.222:4001"
else
    echo "❌ Production backend is not accessible. Please check the server status."
    exit 1
fi

# Check if production GraphQL is accessible
if curl -s -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' http://72.60.108.222:4001/graphql > /dev/null; then
    echo "✅ Production GraphQL API is accessible at http://72.60.108.222:4001/graphql"
else
    echo "⚠️  Production GraphQL API might not be accessible"
fi

# Start Next.js frontend (will connect to production backend)
echo "🌐 Starting Next.js frontend (connecting to production backend)..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Next.js frontend is running on http://localhost:3000"
else
    echo "❌ Failed to start Next.js frontend"
    exit 1
fi

# Check if nginx is running
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Nginx proxy is running on http://localhost:8080"
    echo ""
    echo "🎉 Development environment is ready with production backend!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔗 Nginx Proxy: http://localhost:8080"
    echo "📡 Production Backend: http://72.60.108.222:4001"
    echo "📊 Production GraphQL: http://72.60.108.222:4001/graphql"
    echo "🌐 Production Frontend: http://72.60.108.222:3001"
    echo ""
    echo "Press Ctrl+C to stop the frontend server"
else
    echo "⚠️  Nginx is not running. Please start it with: brew services start nginx"
    echo "📱 Frontend: http://localhost:3000"
    echo "📡 Production Backend: http://72.60.108.222:4001"
    echo "🌐 Production Frontend: http://72.60.108.222:3001"
fi

# Wait for user to stop
wait


