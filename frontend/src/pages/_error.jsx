import ErrorMessage from "@components/messages/ErrorMessage";
import * as React from "react";

const Error = ({ statusCode }) => {
	return <ErrorMessage statusCode={statusCode} />;
};

Error.getInitialProps = async ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

	return { statusCode };
};

export default Error;
