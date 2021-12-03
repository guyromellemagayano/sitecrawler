import { Layout } from "@components/layouts";
import ResetPasswordPageLayout from "@components/layouts/pages/ResetPassword";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink } from "@constants/PageLinks";
import { server } from "@constants/ServerEnv";
import { AppAxiosInstance } from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getStaticProps() {
	const userResponse = await AppAxiosInstance.get(`${server + UserApiEndpoint}`);
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

export default function ResetPassword() {
	// Translations
	const { t } = useTranslation("common");
	const isResetPassword = t("isResetPassword");

	return (
		<>
			<NextSeo title={isResetPassword} />
			<ResetPasswordPageLayout />
		</>
	);
}

ResetPassword.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>;
};
