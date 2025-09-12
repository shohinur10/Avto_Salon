/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4001',
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:4001/graphql',
		REACT_APP_API_WS: process.env.REACT_APP_API_WS || 'ws://localhost:4001/graphql',
	},
	async rewrites() {
		const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4001';
		return [
			{
				source: '/uploads/:path*',
				destination: `${apiUrl}/uploads/:path*`,
			},
		];
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
