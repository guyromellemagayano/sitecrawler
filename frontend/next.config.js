const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const { withSentryConfig } = require("@sentry/nextjs");
const withNextTranslate = require("next-translate");

const NextConfig = {
	trailingSlash: true,
	eslint: {
		dirs: ["pages", "configs", "components", "hooks", "helpers", "styles", "utils"],
		ignoreDuringBuilds: false
	},
	i18n: {
		locales: ["en", "fr", "nl"],
		defaultLocale: "en"
	},
	experimental: {
		removeConsole: process.env.NODE_ENV === "production" ? true : false
	},
	env: {
		SITE_NAME: "SiteCrawler",
		DEVELOPMENT_SITE_URL: "http://localhost:8000",
		DEVELOPMENT_SITE_SERVER_URL: "http://backend:8000",
		LOGROCKET_APP_ID: "epic-design-labs/link-app",
		SENTRY_DSN: "https://3ab17e668d564c0fa8c1e0614c517bd1@o432365.ingest.sentry.io/6037440",
		SENTRY_ENVIRONMENT: "production"
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
