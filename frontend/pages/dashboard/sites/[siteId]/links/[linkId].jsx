import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
import { MemoizedLoader } from "@components/loaders";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useContext } from "react";
import { SWRConfig } from "swr";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	// User
	const userResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	// Sites
	const siteResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + SitesApiEndpoint + query.siteId}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const sitesData = siteResponse?.data ?? null;
	const siteStatus = siteResponse?.status ?? null;

	if (
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		if (
			sitesData !== null &&
			!sitesData?.detail &&
			Object.keys(sitesData)?.length > 0 &&
			Math.round(siteStatus / 200) === 1
		) {
			return {
				props: {
					siteName: sitesData.name,
					fallback: {
						"/api/auth/user/": userData
					}
				}
			};
		} else {
			return {
				redirect: {
					destination: DashboardSitesLink,
					permanent: false
				}
			};
		}
	} else {
		return {
			redirect: {
				destination: LoginLink,
				permanent: false
			}
		};
	}
}

const SiteLinkDetailAuth = ({ siteName }) => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesLinksText = t("sitesLinks");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser("/api/auth/user/");

	// Custom variables
	const sitesLinksPageTitle = sitesLinksText + " - " + siteName;

	return isComponentReady && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<MemoizedLayout>
			<NextSeo title={sitesLinksPageTitle} />
			<MemoizedPageLayout pageTitle={sitesLinksText}>
				<MemoizedComingSoonPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	) : (
		<MemoizedLoader />
	);
};

export default function SiteLinks({ siteName, fallback }) {
	return (
		<SWRConfig value={{ fallback }}>
			<SiteLinkDetailAuth siteName={siteName} />
		</SWRConfig>
	);
}

SiteLinks.getLayout = (page) => page;
