import Layout from "@components/layouts";
import { Loader } from "@components/loaders";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink, SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useGetMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";

// Pre-render `user` data with NextJS SSR. Redirect to a 404 page if the user is not found, redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await useGetMethod(`${server + UserApiEndpoint}`, req.headers);
	const userData = userResponse.data ?? null;
	const userStatus = userResponse.status ?? null;

	if (typeof userData === "undefined" || userData === null) {
		if (userStatus === 404) {
			return {
				notFound: true
			};
		} else {
			return {
				redirect: {
					destination: LoginLink,
					permanent: false
				}
			};
		}
	} else {
		if (userData.detail) {
			return {
				redirect: {
					destination: LoginLink,
					permanent: false
				}
			};
		} else {
			return {
				redirect: {
					destination: SitesLink,
					permanent: false
				}
			};
		}
	}
}

const Home = () => {
	// Router
	const router = useRouter();

	// Translations
	const { t } = useTranslation("home");
	const home = t("home");

	React.useEffect(() => {
		router.prefetch(SitesLink);
		router.prefetch(LoginLink);
	}, []);

	return (
		<Layout>
			<NextSeo title={home} />
			<Loader />
		</Layout>
	);
};

Home.propTypes = {
	userData: PropTypes.object,
	userStatus: PropTypes.number
};

export default Home;
