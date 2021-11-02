// Environment
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";
export const isStaging = process.env.NODE_ENV === "staging";

// Server
export const server = isDev
	? process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_URL
	: isProd
	? process.env.NEXT_PUBLIC_PRODUCTION_SITE_URL
	: process.env.NEXT_PUBLIC_STAGING_SITE_URL;
