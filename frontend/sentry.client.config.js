import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
	environment: "production",
	dsn: SENTRY_DSN || "https://0f57a311ac1b4bc38f7ebae7c1a890df@o432365.ingest.sentry.io/5702974"
});
