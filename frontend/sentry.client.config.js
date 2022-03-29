import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const SentryDsn = isProduction ? process.env.SENTRY_DSN : null;
const SentryEnv = process.env.SENTRY_ENVIRONMENT;

Sentry.init({
	environment: SentryEnv,
	tracesSampleRate: 1.0,
	dsn: SentryDsn || "https://3ab17e668d564c0fa8c1e0614c517bd1@o432365.ingest.sentry.io/6037440"
});
