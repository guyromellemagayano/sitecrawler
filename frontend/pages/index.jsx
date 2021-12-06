import { MemoizedLayout } from "@components/layouts";
import { Loader } from "@components/loaders";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";

// Pre-render `user` data with NextJS SSR. Redirect to a 404 page if the user is not found, redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps() {
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`);
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
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

export default function Home() {
	// Translations
	const { t } = useTranslation("home");
	const home = t("home");

	return (
		<>
			<NextSeo title={home} />
			<Loader />
		</>
	);
}

Home.getLayout = function getLayout(page) {
	return <MemoizedLayout>{page}</MemoizedLayout>;
};

Home.requiresAuth = false;
