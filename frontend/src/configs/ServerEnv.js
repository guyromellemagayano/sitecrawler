// Environment
export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";

// Server
export const server = isDev
	? process.env.NEXT_PUBLIC_DEVELOPMENT_SITE_URL
	: typeof window !== "undefined"
	? window.location.protocol + "//" + window.location.hostname
	: "";
