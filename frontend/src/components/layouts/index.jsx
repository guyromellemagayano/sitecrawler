import { Alert } from "@components/alerts";
import { LoginLink, SitesLink } from "@configs/PageLinks";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
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
	// Router
	const router = useRouter();

	// Prefetch sites page for faster loading
	React.useEffect(() => {
		router.prefetch(SitesLink);
		router.prefetch(LoginLink);
	}, []);

	return (
		<Sentry.ErrorBoundary
			fallback={({ error, componentStack }) => AlertFallback({ message: error, component: componentStack })}
		>
			<main tw="h-screen">{children}</main>
		</Sentry.ErrorBoundary>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

export default Layout;
