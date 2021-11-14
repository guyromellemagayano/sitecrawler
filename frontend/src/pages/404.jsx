import { ErrorMessage } from "@components/messages";
import * as React from "react";

const Custom404 = () => {
	return <ErrorMessage statusCode={404} />;
};

export default Custom404;
