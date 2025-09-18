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

// Custom WebSocket client
class LoggingWebSocket {
	private socket: WebSocket | null = null;

	constructor(url: string) {
		try {
			// Only connect if we're in the browser and have a valid URL
			if (typeof window !== 'undefined' && url && url.startsWith('ws://')) {
				this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
				socketVar(this.socket);

				this.socket.onopen = () => {
					console.log('WebSocket connection established!');
				};

				this.socket.onmessage = (msg) => {
					console.log('WebSocket message:', msg.data);
				};

				this.socket.onerror = (error) => {
					console.warn('WebSocket connection error:', error);
				};

				this.socket.onclose = () => {
					console.log('WebSocket connection closed');
				};
			} else {
				console.warn('WebSocket connection skipped - invalid URL or server-side rendering');
			}
		} catch (error) {
			console.warn('Failed to create WebSocket connection:', error);
		}
	}

	send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
		if (this.socket) {
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
			console.warn('requesting.. ', operation);
			return forward(operation);
		});

		const graphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL || 'http://72.60.108.222:4001/graphql';
		console.log('GraphQL URL:', graphqlUrl);
		
		// @ts-ignore
		const link = new createUploadLink({
			uri: graphqlUrl,
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsUrl = process.env.REACT_APP_API_WS || 'ws://72.60.108.222:4001';
		console.log('WebSocket URL:', wsUrl);
		
		const wsLink = new WebSocketLink({
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

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
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

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for development process

const httpLink = createHttpLink({
  uri: "http://localhost:3005/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/