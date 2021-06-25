// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import PropTypes from "prop-types";

// Hooks
import useUser from "src/hooks/useUser";

const Home = () => {
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		user !== undefined ? router.push("/sites") : router.push("/login");
	}, [user]);

	return null;
};

Home.propTypes = {};

export default Home;
