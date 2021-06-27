// React
import { useEffect } from "react";

// External
import "twin.macro";
import * as Sentry from "@sentry/nextjs";
import LogRocket from "logrocket";

const Layout = ({ user, children }) => {
	useEffect(() => {
		process.env.NODE_ENV === "production"
			? user
				? (() => {
						LogRocket.identify("epic-design-labs/link-app", {
							name: user?.first_name + " " + user?.last_name,
							email: user?.email
						});

						Sentry.setUser({ id: user?.pk, email: user?.email, username: user?.username });
				  })()
				: Sentry.configureScope((scope) => scope.setUser(null))
			: null;
	}, [user]);

	return (
		<div id="root-auth">
			<main tw="h-screen">{children}</main>
		</div>
	);
};

export default Layout;
