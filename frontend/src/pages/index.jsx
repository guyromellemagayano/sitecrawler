// React
import { useState, useEffect } from "react";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import useUser from "src/hooks/useUser";

// Contexts
import { redirectAuth } from "src/contexts/auth";

// Layout
import Layout from "src/components/Layout";

// Components
const Login = loadable(() => import("src/components/layout/Login"));
const Dashboard = loadable(() => import("src/components/layout/Dashboard"));

const Home = ({ token }) => {
	const [userInfo, setUserInfo] = useState([]);
	const [tokenKey, setTokenKey] = useState("");

	const { user: user } = useUser({
		token: token,
	});

	useEffect(() => {
		if (user && user !== undefined && Object.keys(user).length > 0 && token && token !== undefined && token !== "") {
			setUserInfo(user);
			setTokenKey(token);
		}
	}, [user, token]);

	return (
		<Layout>
			{userInfo !== undefined && tokenKey !== "" ? <Dashboard userInfo={userInfo} tokenKey={tokenKey} /> : <Login />}
		</Layout>
	);
};

export async function getServerSideProps({ req, res }) {
	let token = getCookie("token", req);
	redirectAuth(token, res);

	return {
		props: {},
	};
}

Home.propTypes = {};

export default Home;
