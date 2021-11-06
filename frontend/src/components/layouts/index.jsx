import { FallbackMessageAlert } from "@components/alerts";
import * as Sentry from "@sentry/nextjs";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const Layout = ({ children }) => {
	return (
		<Sentry.ErrorBoundary fallback={FallbackMessageAlert}>
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
