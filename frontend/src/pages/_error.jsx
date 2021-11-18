import Layout from "@components/layouts";
import { ErrorMessage } from "@components/messages";
import * as React from "react";

/**
 * Memoized component for Error page
 */
const Error = React.memo(({ statusCode }) => {
	return <ErrorMessage statusCode={statusCode} />;
});

Error.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

Error.getInitialProps = async ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	return { statusCode };
};

export default Error;
