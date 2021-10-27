import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const SentryDsn = isProduction ? process.env.SENTRY_DSN : null;
const SentryEnv = process.env.SENTRY_ENVIRONMENT;

Sentry.init({
	environment: SentryEnv,
	tracesSampleRate: 0.01,
	dsn: SentryDsn
});
