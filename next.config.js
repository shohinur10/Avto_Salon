/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	telemetry: false,
	experimental: {
		// Disable telemetry and external network calls
		telemetry: false,
	},
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
	},
	async rewrites() {
		return [
			{
				source: '/uploads/:path*',
				destination: `${process.env.REACT_APP_API_URL}/uploads/:path*`,
			},
		];
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
