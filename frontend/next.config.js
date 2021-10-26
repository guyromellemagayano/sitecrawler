const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const withNextTranslate = require("next-translate");
const { withSentryConfig } = require("@sentry/nextjs");

const basePath = "";
const isProduction = process.env.NODE_ENV === "production";

const SentryAuthToken = isProduction ? process.env.SENTRY_AUTH_TOKEN : null;
const SentryOrg = isProduction ? process.env.SENTRY_ORG : null;
const SentryProject = isProduction ? process.env.SENTRY_PROJECT : null;
const SentryUrl = isProduction ? process.env.SENTRY_URL : null;

const NextConfig = {
	trailingSlash: true,
	devIndicators: {
		buildActivity: false
	},
	eslint: {
		dirs: ["pages", "enums", "components", "hooks", "helpers"],
		ignoreDuringBuilds: true
	},
	webpack: (config, options) => {
		config.resolve.fallback = { fs: false, module: false };

		return config;
	},
	i18n: {
		locales: ["en", "fr", "nl"],
		defaultLocale: "en"
	},
	sentry: {
		disableServerWebpackPlugin: isProduction ? false : true,
		disableClientWebpackPlugin: isProduction ? false : true
	},
	productionBrowserSourceMaps: true
};

const SentryWebpackPluginOptions = {
	include: ".next",
	ignore: ["node_modules"],
	stripPrefix: ["webpack://_N_E/"],
	urlPrefix: `~${basePath}/_next`,
	url: SentryUrl,
	org: SentryOrg,
	authToken: SentryAuthToken,
	project: SentryProject
};

module.exports = withPlugins([
	withNextTranslate(withBundleAnalyzer(withSentryConfig(NextConfig, SentryWebpackPluginOptions)))
]);
