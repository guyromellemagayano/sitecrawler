import { useRouter } from "next/router";
import * as React from "react";
import useUser from "src/hooks/useUser";

const Home = () => {
	const router = useRouter();

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		user !== undefined ? router.push("/sites") : router.push("/login");
	}, []);

	return null;
};

Home.propTypes = {};

export default Home;
