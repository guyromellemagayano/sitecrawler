const { withSentryConfig } = require("@sentry/nextjs");

const SENTRY_URL = process.env.SENTRY_URL || process.env.NEXT_PUBLIC_SENTRY_URL;
const SENTRY_ORG = process.env.SENTRY_ORG || process.env.NEXT_PUBLIC_SENTRY_ORG;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT || process.env.NEXT_PUBLIC_SENTRY_PROJECT;

const moduleExports = {
	trailingSlash: true,
	devIndicators: {
		autoPrerender: false
	},
	eslint: {
		dirs: ["pages", "utils", "components"]
	}
};

const SentryWebpackPluginOptions = {
	include: ".",
	url: SENTRY_URL || "https://sentry.io/organizations/epic-design-labs/",
	org: SENTRY_ORG || "epic-design-labs",
	authToken: SENTRY_AUTH_TOKEN || "21024702c44e4bf3a4ac704e27d82a5e7cb2be29340046dc8d9c6d0b06a92ff1",
	project: SENTRY_PROJECT || "sitecrawler-frontend"
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
