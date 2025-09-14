/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://nestar-api:3005',
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL || 'http://nestar-api:3005/graphql',
		REACT_APP_API_WS: process.env.REACT_APP_API_WS || 'ws://nestar-api:3005',
	},
	async rewrites() {
		const apiUrl = process.env.REACT_APP_API_URL || 'http://nestar-api:3005';
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
