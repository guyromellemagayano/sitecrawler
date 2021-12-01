import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";

export default function MyError({ statusCode, hasGetInitialPropsRun, err }) {
	if (!hasGetInitialPropsRun && err) {
		Sentry.captureException(err);
	}

	return <NextErrorComponent statusCode={statusCode} />;
}
