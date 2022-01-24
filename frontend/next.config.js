const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const { withSentryConfig } = require("@sentry/nextjs");
const withNextTranslate = require("next-translate");

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
		removeConsole: process.env.NODE_ENV === "production" ? true : false
	},
	// async redirects() {
	// 	return [
	// 		{
	// 			source: "/dashboard",
	// 			destination: "/dashboard/sites",
	// 			permanent: true
	// 		},
	// 		{
	// 			source: "/dashboard/settings",
	// 			destination: "/dashboard/settings/profile",
	// 			permanent: true
	// 		},
	// 		{
	// 			source: "/dashboard/site",
	// 			destination: "/dashboard/sites",
	// 			permanent: true
	// 		},
	// 		{
	// 			source: "/dashboard/site/:siteId",
	// 			destination: "/dashboard/sites/:siteId/overview",
	// 			permanent: true
	// 		},
	// 		{
	// 			source: "/dashboard/sites/:siteId",
	// 			destination: "/dashboard/sites/:siteId/overview",
	// 			permanent: true
	// 		}
	// 	];
	// }
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
