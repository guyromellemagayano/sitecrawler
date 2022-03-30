import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSiteLinkDetailPageLayout } from "@components/layouts/pages/SiteLinkDetail";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink, ScanSlug, SiteLinkSlug } from "@constants/PageLinks";
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

	// Handle `scanObjId` search
	const scanObjId = scanData?.results[0]?.id ?? null;

	// Links
	const linkResponse = await AppAxiosInstance.get(
		`${SSR_SITE_URL + SitesApiEndpoint + query.siteId + ScanSlug + scanObjId + SiteLinkSlug + query.linkId + "/"}`,
		{
			headers: {
				cookie: req.headers.cookie ?? null
			}
		}
	);
	const linkData = linkResponse?.data ?? null;
	const linkStatus = linkResponse?.status ?? null;

	if (userData && Math.round(userStatus / 100) === 2 && !userData?.detail) {
		if (
			siteData &&
			Object.keys(siteData)?.length > 0 &&
			Math.round(siteStatus / 100) === 2 &&
			!siteData?.detail &&
			scanData &&
			Object.keys(scanData)?.length > 0 &&
			Math.round(scanStatus / 100) === 2 &&
			!scanData?.detail &&
			scanData?.count > 0 &&
			linkData &&
			Object.keys(linkData)?.length > 0 &&
			Math.round(linkStatus / 100) === 2 &&
			!linkData?.detail
		) {
			return {
				props: {
					siteName: siteData.name,
					linkUrl: linkData.url
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

const SiteLinkDetailAuth = ({ siteName, linkUrl }) => {
	// Translations
	const { t } = useTranslation("sites");
	const sitesLinksText = t("sitesLinks");

	// Custom variables
	const sitesLinksPageTitle = linkUrl + " - " + siteName;

	return (
		<MemoizedLayout>
			<NextSeo title={sitesLinksPageTitle} />
			<MemoizedPageLayout pageTitle={linkUrl}>
				<MemoizedSiteLinkDetailPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function SiteLinks({ siteName, linkUrl }) {
	return (
		<SWRConfig>
			<SiteLinkDetailAuth siteName={siteName} linkUrl={linkUrl} />
		</SWRConfig>
	);
}

SiteLinks.getLayout = (page) => page;
