import Layout from "@components/layouts";
import Loader from "@components/loader";
import RedirectingToPage from "@components/messages/RedirectingToPage";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink, SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { handleUser } from "@helpers/handleUser";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
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
	const userStatus = userResponse?.status ?? null;

	return {
		props: {
			fallback: {
				userStatus: userStatus ?? null,
				userApiEndpoint: userData ?? null
			}
		}
	};
}

const HomeBody = ({ fallback = null }) => {
	const { validatingUser, isUserReady } = handleUser({
		endpoint: fallback?.userApiEndpoint ?? null,
		status: fallback?.userStatus ?? null
	});

	return validatingUser && !isUserReady ? (
		<Loader />
	) : !validatingUser && isUserReady && Math.round(fallback?.userStatus / 200) === 1 ? (
		<RedirectingToPage page="Sites Dashboard" />
	) : !validatingUser && Math.round(fallback?.userStatus / 200) !== 1 ? (
		<RedirectingToPage page="Login" />
	) : null;
};

const Home = ({ fallback }) => {
	// Router
	const router = useRouter();

	// Translations
	const { t } = useTranslation("home");
	const home = t("Home");

	React.useEffect(() => {
		router.prefetch(SitesLink);
		router.prefetch(LoginLink);
	}, []);

	return (
		<SWRConfig value={{ fallback }}>
			<Layout>
				<NextSeo title={home} />
				<HomeBody fallback={fallback} />
			</Layout>
		</SWRConfig>
	);
};

export default Home;
