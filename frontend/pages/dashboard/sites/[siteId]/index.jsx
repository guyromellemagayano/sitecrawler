import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSiteOverviewPageLayout } from "@components/layouts/pages/SiteOverview";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink, ScanSlug } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
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
	const siteData = siteResponse?.data ?? null;
	const siteStatus = siteResponse?.status ?? null;

	// Scan
	const scanResponse = await AppAxiosInstance.get(`${SSR_SITE_URL + SitesApiEndpoint + query.siteId + ScanSlug}`, {
		headers: {
			cookie: req.headers.cookie ?? null
		}
	});
	const scanData = scanResponse?.data ?? null;
	const scanStatus = scanResponse?.status ?? null;

	if (userData && Math.round(userStatus / 100) === 2 && !userData?.detail) {
		if (
			siteData &&
			Math.round(siteStatus / 100) === 2 &&
			!siteData?.detail &&
			scanData &&
			Math.round(scanStatus / 100) === 2 &&
			!scanData?.detail &&
			(!siteData?.verified || siteData?.verified) &&
			scanData?.count > 0
		) {
			return {
				props: {
					siteName: siteData.name
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

const SiteOverviewAuth = ({ siteName }) => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesOverviewText = t("sitesOverview");

	// Custom variables
	const sitesOverviewPageTitle = sitesOverviewText + " - " + siteName;

	return (
		<MemoizedLayout>
			<NextSeo title={sitesOverviewPageTitle} />
			<MemoizedPageLayout pageTitle={sitesOverviewText}>
				<MemoizedSiteOverviewPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function SiteOverview({ siteName }) {
	return (
		<SWRConfig>
			<SiteOverviewAuth siteName={siteName} />
		</SWRConfig>
	);
}

SiteOverview.getLayout = (page) => page;
