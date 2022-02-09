// Environment
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";

// Site URL
export const SITE_URL =
	typeof window !== "undefined" && isProd
		? window.location.protocol + "//" + window.location.hostname
		: process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_URL;

// SSR Site URL
export const SSR_SITE_URL =
	typeof window !== "undefined" && isProd
		? window.location.protocol + "//" + window.location.hostname
		: process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_SERVER_URL;
