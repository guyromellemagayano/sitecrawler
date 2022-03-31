import { MemoizedLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedSiteImageDetailPageLayout } from "@components/layouts/pages/SiteImageDetail";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { DashboardSitesLink, LoginLink, ScanSlug, SiteImageSlug, SiteImagesSlug } from "@constants/PageLinks";
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

	// Images
	const imageResponse = await AppAxiosInstance.get(
		`${SSR_SITE_URL + SitesApiEndpoint + query.siteId + ScanSlug + scanObjId + SiteImageSlug + query.imageId + "/"}`,
		{
			headers: {
				cookie: req.headers.cookie ?? null
			}
		}
	);
	const imageData = imageResponse?.data ?? null;
	const imageStatus = imageResponse?.status ?? null;

	if (userData && Math.round(userStatus / 100) === 2 && !userData?.detail) {
		if (siteData && Object.keys(siteData)?.length > 0 && Math.round(siteStatus / 100) === 2 && !siteData?.detail) {
			if (
				scanData &&
				Object.keys(scanData)?.length > 0 &&
				Math.round(scanStatus / 100) === 2 &&
				!scanData?.detail &&
				scanData?.count > 0 &&
				imageData &&
				Object.keys(imageData)?.length > 0 &&
				Math.round(imageStatus / 100) === 2 &&
				!imageData?.detail
			) {
				return {
					props: {
						siteName: siteData.name,
						imageUrl: imageData.url
					}
				};
			} else {
				return {
					redirect: {
						destination: DashboardSitesLink + query.siteId + SiteImagesSlug,
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

const SiteImageDetailAuth = ({ siteName, imageUrl }) => {
	// Custom variables
	const sitesImagesPageTitle = imageUrl + " - " + siteName;

	return (
		<MemoizedLayout>
			<NextSeo title={sitesImagesPageTitle} />
			<MemoizedPageLayout pageTitle={imageUrl}>
				<MemoizedSiteImageDetailPageLayout />
			</MemoizedPageLayout>
		</MemoizedLayout>
	);
};

export default function SiteImageDetail({ siteName, imageUrl }) {
	return (
		<SWRConfig>
			<SiteImageDetailAuth siteName={siteName} imageUrl={imageUrl} />
		</SWRConfig>
	);
}

SiteImageDetail.getLayout = (page) => page;
