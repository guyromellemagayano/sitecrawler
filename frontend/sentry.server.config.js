import { isProd } from "@constants/ServerEnv";
import * as Sentry from "@sentry/nextjs";

const SentryDsn = isProd ? process.env.SENTRY_DSN : null;
const SentryEnv = process.env.SENTRY_ENVIRONMENT;

Sentry.init({
	environment: SentryEnv,
	tracesSampleRate: 1.0,
	dsn: SentryDsn,
	beforeSend(event) {
		// Check if it is an exception, and if so, show the report dialog
		if (event.exception) {
			Sentry.showReportDialog({ eventId: event.event_id });
		}

		return event;
	}
});
