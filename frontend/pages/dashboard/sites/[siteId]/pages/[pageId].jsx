import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSitePageDetailPageLayout } from "@components/layouts/pages/SitePageDetail";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink, ScanSlug, SitePageSlug, SitePagesSlug } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import AppAxiosInstance from "@utils/axios";
import { NextSeo } from "next-seo";
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

	// Pages
	const pageResponse = await AppAxiosInstance.get(
		`${SSR_SITE_URL + SitesApiEndpoint + query.siteId + ScanSlug + scanObjId + SitePageSlug + query.pageId + "/"}`,
		{
			headers: {
				cookie: req.headers.cookie ?? null
			}
		}
	);
	const pageData = pageResponse?.data ?? null;
	const pageStatus = pageResponse?.status ?? null;

	if (userData && Math.round(userStatus / 100) === 2 && !userData?.detail) {
		if (siteData && Object.keys(siteData)?.length > 0 && Math.round(siteStatus / 100) === 2 && !siteData?.detail) {
			if (
				scanData &&
				Object.keys(scanData)?.length > 0 &&
				Math.round(scanStatus / 100) === 2 &&
				!scanData?.detail &&
				scanData?.count > 0 &&
				pageData &&
				Object.keys(pageData)?.length > 0 &&
				Math.round(pageStatus / 100) === 2 &&
				!pageData?.detail
			) {
				return {
					props: {
						siteName: siteData.name,
						pageUrl: pageData.url
					}
				};
			} else {
				return {
					redirect: {
						destination: DashboardSitesLink + query.siteId + SitePagesSlug,
						permanent: false
					}
				};
			}
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

const SitePageDetailAuth = ({ siteName, pageUrl }) => {
	// Custom variables
	const sitesPagesPageTitle = pageUrl + " - " + siteName;

	return (
		<MemoizedLayout>
			<NextSeo title={sitesPagesPageTitle} />
			<MemoizedPageLayout pageTitle={pageUrl}>
				<MemoizedSitePageDetailPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function SitePageDetail({ siteName, pageUrl }) {
	return (
		<SWRConfig>
			<SitePageDetailAuth siteName={siteName} pageUrl={pageUrl} />
		</SWRConfig>
	);
}

SitePageDetail.getLayout = (page) => page;
