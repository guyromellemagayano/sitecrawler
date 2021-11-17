import Layout from "@components/layouts";
import { RegistrationPageLayout } from "@components/layouts/pages/Registration";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import { LoginLink, SitesLink } from "@configs/PageLinks";
import { server } from "@configs/ServerEnv";
import { useGetMethod } from "@hooks/useHttpMethod";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";
import "twin.macro";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await useGetMethod(`${server + UserApiEndpoint}`, req.headers);
	const userData = userResponse.data ?? null;
	const userStatus = userResponse.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData.detail &&
		Object.keys(userData).length > 0 &&
		Math.round(userStatus / 200 === 1)
	) {
		return {
			redirect: {
				destination: SitesLink,
				permanent: false
			}
		};
	} else {
		return {
			props: {}
		};
	}
}

const Registration = () => {
	// Router
	const router = useRouter();

	// Translations
	const { t } = useTranslation("registration");
	const registration = t("registration");

	// Prefetch sites page for faster loading
	React.useEffect(() => {
		router.prefetch(SitesLink);
		router.prefetch(LoginLink);
	}, []);

	return (
		<Layout>
			<NextSeo title={registration} />
			<RegistrationPageLayout />
		</Layout>
	);
};

export default Registration;
