// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import PropTypes from "prop-types";

// Hooks
import useUser from "src/hooks/useUser";

const Home = () => {
	const [userExists, setUserExists] = React.useState(false);

	const sitesPage = "/sites/";
	const loginPage = "/login/";

	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		user ? setUserExists(true) : setUserExists(false);
	}, [user, userExists]);

	React.useEffect(() => {
		userExists ? router.push(sitesPage) : router.push(loginPage);
	});

	return null;
};

Home.propTypes = {};

export default Home;

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}
