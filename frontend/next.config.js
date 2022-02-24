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
	env: {
		LOGROCKET_APP_ID: "epic-design-labs/link-app"
	},
	async redirects() {
		return [
			{
				source: "/login",
				destination: "/",
				permanent: false
			},
			{
				source: "/dashboard/settings",
				destination: "/dashboard/settings/profile",
				permanent: false
			},
			{
				source: "/dashboard/site",
				destination: "/dashboard/sites",
				permanent: false
			},
			{
				source: "/dashboard/site/:siteId",
				destination: "/dashboard/sites/:siteId/overview",
				permanent: false
			},
			{
				source: "/dashboard/sites/:siteId",
				destination: "/dashboard/sites/:siteId/overview",
				permanent: false
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
