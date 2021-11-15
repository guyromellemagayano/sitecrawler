import Alert from "@components/alerts";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const AlertFallback = ({ message, component }) => {
	// Translations
	const { t } = useTranslation("alerts");
	const fallbackUnknownError = t("fallbackUnknownError", { message: message.toString, component: component });

	return <Alert message={fallbackUnknownError} isError />;
};

AlertFallback.propTypes = {
	component: PropTypes.any,
	message: PropTypes.shape({
		toString: PropTypes.string
	})
};

const Layout = ({ children }) => {
	return (
		<Sentry.ErrorBoundary
			fallback={({ error, componentStack }) => AlertFallback({ message: error, component: componentStack })}
		>
			<div id="root-auth">
				<main tw="h-screen">{children}</main>
			</div>
		</Sentry.ErrorBoundary>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

export default Layout;
