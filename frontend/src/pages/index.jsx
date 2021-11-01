import Layout from "@components/layouts";
import * as React from "react";

const Home = ({ res }) => {
	console.log(res);

	return <Layout />;
};

export async function getServerSideProps() {
	const req = await fetch("http://0.0.0.0:8000/api/auth/user/?format=json");
	const res = await req.json();

	return {
		props: {
			res: res
		}
	};
}

export default Home;
