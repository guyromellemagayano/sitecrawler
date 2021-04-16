// React
import { useEffect } from "react";

// External
import "twin.macro";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

// Utils
import { useHistory } from "src/utils/history";

const Layout = ({ user, children }) => {
	// FIXME: figure something out this useHistory()
	const { history } = useHistory();

	// console.log(history);

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0) {
			if (typeof window !== "undefined") {
				LogRocket.init("epic-design-labs/link-app");
				setupLogRocketReact(LogRocket);
			}

			LogRocket.identify("epic-design-labs/link-app", {
				name: user.first_name + " " + user.last_name,
				email: user.email
			});
		}
	}, [user]);

	return (
		<div id="root-auth">
			<main tw="min-h-screen">{children}</main>
		</div>
	);
};

export default Layout;
