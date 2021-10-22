import { server } from "@configs/envSetup";
import { UserApiEndpoint } from "@enums/ApiEndpoints";
import { EndpointRefreshInterval } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import useFetcher from "@hooks/useFetcher";
import * as Sentry from "@sentry/nextjs";
import { sleep } from "@utils/sleep";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import useSWR, { SWRConfig } from "swr";

const AuthLayout = ({ fallback }) => {
	const { data: user } = useSWR(UserApiEndpoint, useFetcher, { fallbackData: fallback });

	const router = useRouter();

	React.useEffect(() => {
		user.hasOwnProperty("user") && user.user == null ? router.push(LoginLink) : router.push(SitesLink);
	}, [user]);

	return null;
};

const Home = ({ fallback }) => {
	return (
		<SWRConfig value={{ fallback }}>
			<AuthLayout fallback={fallback} />
		</SWRConfig>
	);
};

Home.propTypes = {
	user: PropTypes.any
};

export async function getServerSideProps() {
	axios.defaults.headers.post["X-CSRFToken"] = Cookies.get("csrftoken");

	const user = await axios
		.get(`${server + UserApiEndpoint}`, {
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		})
		.then(sleep(EndpointRefreshInterval))
		.then((response) => response)
		.catch((error) => {
			error.response
				? (() => {
						Sentry.captureException(error.response.data);
						Sentry.captureException(error.response.status);
						Sentry.captureException(error.response.headers);
				  })()
				: error.request
				? (() => {
						Sentry.captureException(error.request);
				  })()
				: Sentry.captureException(error.message);

			Sentry.captureException(error.config);
		});

	return {
		props: {
			fallback: {
				user: user || null
			}
		}
	};
}

export default Home;
