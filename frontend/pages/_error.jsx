import * as Sentry from "@sentry/nextjs";
import NextErrorComponent from "next/error";

const MyError = ({ statusCode, hasGetInitialPropsRun, err }) => {
	if (!hasGetInitialPropsRun && err) {
		// getInitialProps is not called in case of
		// https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
		// err via _app.js so it can be captured
		Sentry.captureException(err);
		// Flushing is not required in this case as it only happens on the client
	}

	return <NextErrorComponent statusCode={statusCode} />;
};

MyError.getInitialProps = async ({ res, err, asPath }) => {
	const errorInitialProps = await NextErrorComponent.getInitialProps({
		res,
		err
	});

	errorInitialProps.hasGetInitialPropsRun = true;

	if (err) {
		Sentry.captureException(err);

		await Sentry.flush(2000);

		return errorInitialProps;
	}

	Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`));

	await Sentry.flush(2000);

	return errorInitialProps;
};

export default MyError;
