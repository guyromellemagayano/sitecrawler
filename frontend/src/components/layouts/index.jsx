import { FallbackMessageAlert } from "@components/alerts/FallbackMessageAlert";
import Loader from "@components/loader";
import { useUser } from "@hooks/useUser";
import * as Sentry from "@sentry/nextjs";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const fallbackMessageAlert = () => <FallbackMessageAlert />;

export const AuthLayout = ({ children }) => {
	const { validatingUser } = useUser();

	return !validatingUser ? (
		<Sentry.ErrorBoundary fallback={fallbackMessageAlert}>
			<div id="root-auth">
				<main tw="h-screen">{children}</main>
			</div>
		</Sentry.ErrorBoundary>
	) : (
		<Loader />
	);
};

AuthLayout.propTypes = {
	children: PropTypes.any
};
