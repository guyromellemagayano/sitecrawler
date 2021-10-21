const { withSentryConfig } = require("@sentry/nextjs");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});

const SENTRY_URL = process.env.SENTRY_URL || process.env.NEXT_PUBLIC_SENTRY_URL;
const SENTRY_ORG = process.env.SENTRY_ORG || process.env.NEXT_PUBLIC_SENTRY_ORG;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || process.env.NEXT_PUBLIC_SENTRY_PROJECT;

const ModuleExports = {
	trailingSlash: true,
	devIndicators: {
		autoPrerender: false
	},
	eslint: {
		dirs: ["pages", "enums", "components", "hooks", "helpers"],
		ignoreDuringBuilds: true
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, module: false };
		return config;
	},
	i18n: {
		locales: ["en", "fr", "nl"],
		defaultLocale: "en"
	},
	sentry: {
		disableServerWebpackPlugin: true,
		disableClientWebpackPlugin: true
	}
};

const BundleAnalyzerPluginOptions = {};

const SentryWebpackPluginOptions = {
	include: ".",
	url: SENTRY_URL || "https://sentry.io/organizations/epic-design-labs/",
	org: SENTRY_ORG || "epic-design-labs",
	authToken: SENTRY_AUTH_TOKEN || "21024702c44e4bf3a4ac704e27d82a5e7cb2be29340046dc8d9c6d0b06a92ff1",
	project: SENTRY_PROJECT || "sitecrawler-frontend"
};

module.exports = withPlugins([
	withBundleAnalyzer(BundleAnalyzerPluginOptions),
	withSentryConfig(ModuleExports, SentryWebpackPluginOptions)
]);
