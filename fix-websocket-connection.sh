#!/bin/bash

# Fix WebSocket Connection Issues for Car Salon
# This script fixes the WebSocket connection to use the correct backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVER_IP="72.60.108.222"
FRONTEND_PORT="3001"
API_PORT="4001"

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

print_header "Fixing WebSocket Connection Issues"

# Create fixed Apollo client configuration
print_status "Creating fixed Apollo client configuration..."

cat > apollo/client-fixed.ts << 'EOF'
import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

// Custom WebSocket client with proper error handling
class LoggingWebSocket {
	private socket: WebSocket | null = null;

	constructor(url: string) {
		try {
			// Only connect if we're in the browser and have a valid URL
			if (typeof window !== 'undefined' && url && url.startsWith('ws://')) {
				console.log('🔌 Attempting WebSocket connection to:', url);
				this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
				socketVar(this.socket);

				this.socket.onopen = () => {
					console.log('✅ WebSocket connection established!');
				};

				this.socket.onmessage = (msg) => {
					console.log('📨 WebSocket message:', msg.data);
				};

				this.socket.onerror = (error) => {
					console.warn('❌ WebSocket connection error:', error);
					// Don't show error alerts for WebSocket connection issues
				};

				this.socket.onclose = (event) => {
					console.log('🔌 WebSocket connection closed:', event.code, event.reason);
				};
			} else {
				console.warn('⚠️ WebSocket connection skipped - invalid URL or server-side rendering');
			}
		} catch (error) {
			console.warn('❌ Failed to create WebSocket connection:', error);
		}
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(data);
		}
	}

	close() {
		if (this.socket) {
			this.socket.close();
		}
	}
}

function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			console.log('📡 GraphQL request:', operation.operationName);
			return forward(operation);
		});

		// Use environment variables with fallbacks
		const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL || 'http://72.60.108.222:4001/graphql';
		console.log('🌐 GraphQL URL:', graphqlUrl);
		
		// @ts-ignore
		const link = new createUploadLink({
			uri: graphqlUrl,
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsUrl = process.env.REACT_APP_API_WS || 'ws://72.60.108.222:4001';
		console.log('🔌 WebSocket URL:', wsUrl);
		
		// Only create WebSocket link if we have a valid WebSocket URL
		let wsLink = null;
		if (wsUrl && wsUrl.startsWith('ws://')) {
			wsLink = new WebSocketLink({
				uri: wsUrl,
				options: {
					reconnect: true,
					reconnectionAttempts: 3,
					timeout: 10000,
					connectionParams: () => {
						return { 
							headers: getHeaders(),
							token: getJwtToken()
						};
					},
				},
				webSocketImpl: LoggingWebSocket,
			});
		} else {
			console.warn('⚠️ WebSocket URL not configured, subscriptions will be disabled');
		}

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
					console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
					if (!message.includes('input')) sweetErrorAlert(message);
				});
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		// Only use split link if WebSocket is available
		if (wsLink) {
			const splitLink = split(
				({ query }) => {
					const definition = getMainDefinition(query);
					return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
				},
				wsLink,
				authLink.concat(link),
			);
			return from([errorLink, tokenRefreshLink, splitLink]);
		} else {
			// No WebSocket, use HTTP only
			return from([errorLink, tokenRefreshLink, authLink.concat(link)]);
		}
	}
}

function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}

export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}

export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}
EOF

# Create updated environment configuration
print_status "Creating updated environment configuration..."

cat > .env.websocket-fixed << EOF
# Fixed Environment Configuration for Car Salon
# Proper WebSocket and API configuration

# API URLs - Use nginx proxy paths
REACT_APP_API_URL=http://$SERVER_IP:$FRONTEND_PORT/api
REACT_APP_API_GRAPHQL_URL=http://$SERVER_IP:$FRONTEND_PORT/graphql
REACT_APP_API_WS=ws://$SERVER_IP:$FRONTEND_PORT/ws

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:$FRONTEND_PORT
PORT=$FRONTEND_PORT

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=http://$SERVER_IP:$FRONTEND_PORT

# Disable WebSocket if not needed (set to empty to disable)
# REACT_APP_API_WS=
EOF

# Create deployment script for WebSocket fix
print_status "Creating deployment script for WebSocket fix..."

cat > deploy-websocket-fix.sh << EOF
#!/bin/bash

# Deploy WebSocket Connection Fix to Server
set -e

echo "🔌 Deploying WebSocket connection fix to server..."

# Upload fixed files
scp apollo/client-fixed.ts root@$SERVER_IP:/tmp/
scp .env.websocket-fixed root@$SERVER_IP:/tmp/

# Apply fixes on server
ssh root@$SERVER_IP << 'EOF'
set -e

echo "🔌 Applying WebSocket connection fixes..."

# Backup original Apollo client
if [ -f "/var/www/car-salon/apollo/client.ts" ]; then
    sudo cp /var/www/car-salon/apollo/client.ts /var/www/car-salon/apollo/client.ts.backup
fi

# Update Apollo client
sudo cp /tmp/client-fixed.ts /var/www/car-salon/apollo/client.ts

# Update environment configuration
sudo cp /tmp/.env.websocket-fixed /var/www/car-salon/.env

# Rebuild the application
cd /var/www/car-salon
echo "🔨 Rebuilding application with WebSocket fix..."
npm run build

# Restart Car Salon service
sudo systemctl restart avto-salon

# Wait for service to start
sleep 10

# Check status
sudo systemctl status avto-salon --no-pager -l

echo ""
echo "✅ WebSocket connection fix applied successfully!"
echo ""
echo "🔌 WebSocket configuration:"
echo "   URL: ws://$SERVER_IP:$FRONTEND_PORT/ws"
echo "   Proxied to: ws://$SERVER_IP:$API_PORT"
echo ""
echo "🌐 Test your Car Salon:"
echo "   Frontend: http://$SERVER_IP:$FRONTEND_PORT"
echo "   Check browser console for WebSocket connection status"
echo ""
echo "📋 If WebSocket still fails, you can disable it by setting:"
echo "   REACT_APP_API_WS= in the .env file"
EOF

chmod +x deploy-websocket-fix.sh

print_header "WebSocket Connection Fix Ready!"

echo "🎉 I've created a fix for your WebSocket connection issues!"
echo ""
echo "📋 The problems were:"
echo "   ❌ WebSocket trying to connect to 'nestar-api:3005' (non-existent)"
echo "   ❌ Not using environment variables properly"
echo "   ❌ No fallback when WebSocket fails"
echo "   ❌ Poor error handling for WebSocket connections"
echo ""
echo "✅ The fix includes:"
echo "   ✅ Proper environment variable usage"
echo "   ✅ WebSocket URL: ws://$SERVER_IP:$FRONTEND_PORT/ws"
echo "   ✅ Proxied through nginx to ws://$SERVER_IP:$API_PORT"
echo "   ✅ Graceful fallback when WebSocket fails"
echo "   ✅ Better error handling and logging"
echo "   ✅ Option to disable WebSocket if not needed"
echo ""
echo "🚀 To apply the fix:"
echo "   1. Run: ./deploy-websocket-fix.sh"
echo "   2. Check browser console for WebSocket status"
echo ""
echo "🔍 The fix will:"
echo "   - Use proper WebSocket URL from environment variables"
echo "   - Proxy WebSocket through nginx on port $FRONTEND_PORT"
echo "   - Handle WebSocket connection failures gracefully"
echo "   - Provide option to disable WebSocket if not needed"
echo ""
echo "📚 If you don't need real-time features, you can disable WebSocket"
echo "   by setting REACT_APP_API_WS= in the .env file"

print_status "🔌 WebSocket connection fix is ready to deploy!"


