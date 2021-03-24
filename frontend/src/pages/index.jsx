// React
import { useState, useEffect } from "react";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const Login = loadable(() => import("src/components/layout/Login"));
const Dashboard = loadable(() => import("src/components/layout/Dashboard"));

const Home = (props) => {
	const [userData, setUserData] = useState([]);
	const [tokenKey, setTokenKey] = useState("");

	const { user: user, error: userError } = useUser();

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			props.token &&
			props.token !== undefined &&
			props.token !== ""
		) {
			setUserData(user);
			setTokenKey(props.token);
		}
	}, [user, props.token]);

	return (
		<Layout user={userData}>
			{userData !== undefined && tokenKey !== "" ? <Dashboard user={userData} token={tokenKey} /> : <Login />}
		</Layout>
	);
};

export async function getServerSideProps({ req }) {
	let token = getCookie("token", req);

	if (!token) {
		return {
			props: {},
		};
	}

	return {
		props: {
			token: token,
		},
	};
}

Home.propTypes = {};

export default Home;
