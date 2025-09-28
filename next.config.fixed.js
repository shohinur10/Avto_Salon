/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	
	// Enable TypeScript checking for better error detection
	typescript: {
		ignoreBuildErrors: false,
	},
	
	// Production optimizations
	compress: true,
	poweredByHeader: false,
	generateEtags: false,
	
	// Environment variables
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
	
	// Image optimization
	images: {
		domains: ['localhost', '72.60.108.222'],
		unoptimized: true, // For static export if needed
	},
	
	// Webpack configuration
	webpack: (config, { isServer }) => {
		// Fix for WebSocket issues
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			};
		}
		return config;
	},
	
	// Headers for security
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
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
