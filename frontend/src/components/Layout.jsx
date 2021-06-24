// React
import { useEffect } from "react";

// External
import "twin.macro";
import { Scrollbars } from "react-custom-scrollbars-2";
import LogRocket from "logrocket";

const Layout = ({ user, children }) => {
	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			if (user && user !== undefined && user !== [] && Object.keys(user).length > 0) {
				LogRocket.identify("epic-design-labs/link-app", {
					name: user.first_name + " " + user.last_name,
					email: user.email
				});
			}
		}
	}, [user]);

	return (
		<div id="root-auth">
			<main tw="h-screen">
				<Scrollbars universal>{children}</Scrollbars>
			</main>
		</div>
	);
};

export default Layout;
