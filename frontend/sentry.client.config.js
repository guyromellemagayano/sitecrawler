import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const SentryDsn = isProduction ? process.env.SENTRY_DSN : null;

Sentry.init({
	environment: isProduction ? "production" : "development",
	tracesSampleRate: 0.01,
	dsn: SentryDsn
});
