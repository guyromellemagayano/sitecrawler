import Layout from "@components/layouts";
import Loader from "@components/loader";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useUser } from "@hooks/useUser";
import axios from "axios";
import { useRouter } from "next/router";
import * as React from "react";
import { SWRConfig } from "swr";

export async function getServerSideProps({ req }) {
	const userResponse = await axios.get(`${server + UserApiEndpoint}`, {
		headers: req.headers,
		validateStatus: (status) => {
			return status < 500;
		}
	});
	const userData = userResponse?.data ?? null;

	return {
		props: {
			fallback: {
				"/api/auth/user/?format=json": userData
			}
		}
	};
}

const Home = ({ fallback }) => {
	const fallbackUserApiEndpoint = "/api/auth/user/?format=json";

	const { validatingUser, errorUser } = useUser(fallbackUserApiEndpoint);
	const { asPath } = useRouter();
	const router = useRouter();

	React.useEffect(() => {
		!validatingUser ? (!errorUser ? router.back() : errorUser && asPath ? router.push(LoginLink) : null) : null;
	}, [validatingUser, errorUser]);

	return (
		<SWRConfig value={{ fallback }}>
			<Layout>
				<Loader />
			</Layout>
		</SWRConfig>
	);
};

export default Home;
