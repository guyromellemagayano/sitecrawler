const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const { withSentryConfig } = require("@sentry/nextjs");
const withNextTranslate = require("next-translate");

const SecurityHeaders = [
	{
		key: "X-DNS-Prefetch-Control",
		value: "on"
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload"
	},
	{
		key: "X-XSS-Protection",
		value: "1; mode=block"
	},
	{
		key: "X-Frame-Options",
		value: "SAMEORIGIN"
	},
	{
		key: "Permissions-Policy",
		value: "geolocation=()"
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff"
	},
	{
		key: "Referrer-Policy",
		value:
			"no-referrer, no-referrer-when-downgrade, same-origin, origin, strict-origin,, origin-when-cross-origin, strict-origin-when-cross-origin, unsafe-url"
	},
	{
		key: "Content-Security-Policy",
		value: "default-src 'self'"
	}
];

const NextConfig = {
	trailingSlash: true,
	devIndicators: {
		ignoreDuringBuilds: true,
		buildActivity: false,
		autoPrerender: false
	},
	eslint: {
		dirs: ["pages", "enums", "components", "hooks", "helpers"],
		ignoreDuringBuilds: true
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, path: false, module: false, os: false };

		return config;
	},
	i18n: {
		locales: ["en", "fr", "nl"],
		defaultLocale: "en"
	},
	productionBrowserSourceMaps: true,
	experimental: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? true
				: {
						exclude: ["error"]
				  }
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: SecurityHeaders
			}
		];
	}
};

const SentryWebpackPluginOptions = {
	include: ".next",
	ignore: ["node_modules"],
	silent: true
};

module.exports = withPlugins([
	withNextTranslate(withBundleAnalyzer(withSentryConfig(NextConfig, SentryWebpackPluginOptions)))
]);
