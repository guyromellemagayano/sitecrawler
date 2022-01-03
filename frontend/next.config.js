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
	}
];

const NextConfig = {
	trailingSlash: true,
	devIndicators: {
		ignoreDuringBuilds: true,
		buildActivity: false,
		autoPrerender: true
	},
	eslint: {
		dirs: ["pages", "configs", "components", "hooks", "helpers", "styles", "utils"],
		ignoreDuringBuilds: false
	},
	i18n: {
		locales: ["en", "fr", "nl"],
		defaultLocale: "en"
	},
	experimental: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? true
				: {
						exclude: ["error"]
				  }
	},
	webpack: (config) => {
		config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false, module: false, os: false };

		return config;
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: SecurityHeaders
			}
		];
	},
	async redirects() {
		return [
			{
				source: "/dashboard",
				destination: "/dashboard/sites",
				permanent: true
			},
			{
				source: "/dashboard/settings",
				destination: "/dashboard/settings/profile",
				permanent: true
			},
			{
				source: "/dashboard/site",
				destination: "/dashboard/sites",
				permanent: true
			},
			{
				source: "/dashboard/site/:siteId",
				destination: "/dashboard/sites/:siteId/overview",
				permanent: true
			},
			{
				source: "/dashboard/sites/:siteId",
				destination: "/dashboard/sites/:siteId/overview",
				permanent: true
			}
		];
	}
};

const SentryWebpackPluginOptions = {
	include: ".",
	ignore: ["node_modules"],
	silent: true,
	sentry: {
		disableServerWebpackPlugin: true,
		disableClientWebpackPlugin: true
	}
};

module.exports = withPlugins([
	withNextTranslate(withBundleAnalyzer(withSentryConfig(NextConfig, SentryWebpackPluginOptions)))
]);
