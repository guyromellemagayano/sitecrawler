import Layout from "@components/layouts";
import ErrorPageLayout from "@components/layouts/pages/Error";
import { memo } from "react";

/**
 * Memoized component for Error page
 */
const Error = memo(({ statusCode }) => {
	return <ErrorPageLayout statusCode={statusCode} />;
});

Error.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

Error.getInitialProps = async ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	return { statusCode };
};

export default Error;
