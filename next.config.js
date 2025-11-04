/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	
	// Skip TypeScript checking during build
	typescript: {
		ignoreBuildErrors: true,
	},
	
	// Production optimizations
	compress: true,
	poweredByHeader: false,
	generateEtags: false,
	
	// Environment variables
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://72.60.236.198:4001',
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL || 'http://72.60.236.198:4001/graphql',
		REACT_APP_API_WS: process.env.REACT_APP_API_WS || 'ws://72.60.236.198:4001',
	},
	
	publicRuntimeConfig: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://72.60.236.198:4001',
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL || 'http://72.60.236.198:4001/graphql',
		REACT_APP_API_WS: process.env.REACT_APP_API_WS || 'ws://72.60.236.198:4001',
	},
	
	// Image optimization
	images: {
		domains: ['72.60.236.198', 'localhost'],
		formats: ['image/webp', 'image/avif'],
		minimumCacheTTL: 60,
	},
	
	// Security headers
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
		];
	},
	
	// API rewrites
	async rewrites() {
		const apiUrl = process.env.REACT_APP_API_URL || 'http://72.60.236.198:4001';
		return [
			{
				source: '/uploads/:path*',
				destination: `${apiUrl}/uploads/:path*`,
			},
		];
	},
	
	
	// Webpack optimizations
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			config.optimization.splitChunks = {
				chunks: 'all',
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			};
		}
		return config;
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
