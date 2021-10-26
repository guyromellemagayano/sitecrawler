import { FallbackMessageAlert } from "@components/alerts/FallbackMessageAlert";
import Loader from "@components/loader";
import { LoginLink } from "@enums/PageLinks";
import { useUser } from "@hooks/useUser";
import * as Sentry from "@sentry/nextjs";
import LogRocket from "logrocket";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const fallbackMessageAlert = () => <FallbackMessageAlert />;

export const AuthLayout = ({ children }) => {
	const { user, validatingUser } = useUser();

	const router = useRouter();

	React.useEffect(() => {
		user && typeof user === "object" && Object.keys(user).length > 0
			? (() => {
					// LogRocket identity
					LogRocket.identify("epic-design-labs/link-app", {
						name: user.first_name + " " + user.last_name,
						email: user.email
					});

					// Sentry setUser
					Sentry.setUser({ id: user.pk, email: user.email, username: user.username });
			  })()
			: router.push(LoginLink);
	}, [user]);

	return !validatingUser ? (
		<Sentry.ErrorBoundary fallback={fallbackMessageAlert} showDialog>
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

export const NoAuthLayout = ({ children }) => {
	return (
		<div id="root-auth">
			<main tw="h-screen">{children}</main>
		</div>
	);
};

NoAuthLayout.propTypes = {
	children: PropTypes.any
};
