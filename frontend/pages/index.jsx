import { MemoizedLayout } from "@components/layouts";
import { MemoizedLoginPageLayout } from "@components/layouts/pages/Login";
import { MemoizedLoader } from "@components/loaders";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { useUser } from "@hooks/useUser";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SiteCrawlerAppContext } from "./_app";


// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req }) {
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	if (
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
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

export default function Home() {
	// Translations
	const { t } = useTranslation();
	const loginText = t("login:login");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return isComponentReady && user && Math.round(user?.status / 100) === 4 && user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={loginText} />
			<MemoizedLoginPageLayout />
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
}

Home.getLayout = (page) => page;
