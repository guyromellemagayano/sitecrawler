import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const SentryDsn = isProduction ? process.env.SENTRY_DSN : null;

Sentry.init({
	environment: "production",
	tracesSampleRate: 1.0,
	dsn: SentryDsn,
	beforeSend(event) {
		event.exception ? Sentry.showReportDialog({ eventId: event.event_id }) : null;

		return event;
	}
});
