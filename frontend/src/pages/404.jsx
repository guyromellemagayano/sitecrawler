import Layout from "@components/layouts";
import ErrorMessage from "@components/messages/ComingSoonMessage";
import * as React from "react";

/**
 * Memoized component for Error page
 */
const Custom404 = React.memo(() => {
	return <ErrorMessage statusCode={404} />;
});

Custom404.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

export default Custom404;
