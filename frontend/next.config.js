const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const { withSentryConfig } = require("@sentry/nextjs");
const withNextTranslate = require("next-translate");

const NextConfig = {
	trailingSlash: true,
	devIndicators: {
		buildActivity: false
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
		removeConsole: {
			exclude: ["error"]
		}
		// Uncomment this to suppress all logs
		// removeConsole: true
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
