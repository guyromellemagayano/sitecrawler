// Environment
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";

// Server
export const server =
	typeof window !== "undefined" && isProd
		? window.location.protocol + "//" + window.location.hostname
		: process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_SERVER_URL;
