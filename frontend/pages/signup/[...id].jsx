import { Layout } from "@components/layouts";
import SignupPageLayout from "@components/layouts/pages/Signup";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SSR_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps() {
	const userResponse = await AppAxiosInstance.get(`${SSR_URL + UserApiEndpoint}`);
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200 === 1)
	) {
		return {
			redirect: {
				destination: DashboardSitesLink,
				permanent: false
			}
		};
	} else {
		return {
			props: {}
		};
	}
}

export default function Signup() {
	// Translations
	const { t } = useTranslation("signup");
	const completeSignup = t("completeSignup");

	return (
		<>
			<NextSeo title={completeSignup} />
			<SignupPageLayout />
		</>
	);
}

Signup.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};

Signup.requiresAuth = false;
