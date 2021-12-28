/* eslint-disable react-hooks/exhaustive-deps */
import { DashboardLayout } from "@components/layouts";
import { MemoizedPageLayout } from "@components/layouts/components/Page";
import { MemoizedComingSoonPageLayout } from "@components/layouts/pages/ComingSoon";
// import { MemoizedSiteOverviewPageLayout } from "@components/layouts/pages/SiteOverview";
import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { customAxiosHeaders } from "@constants/CustomAxiosHeaders";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { SSR_SITE_URL } from "@constants/ServerEnv";
import { useSites } from "@hooks/useSites";
import axios from "axios";
import { NextSeo } from "next-seo";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

// Pre-render `user` data with NextJS SSR. Redirect to a login page if current user is not allowed to access that page (403 Forbidden) or redirect to the sites dashboard page if the user is still currently logged in (200 OK).
export async function getServerSideProps({ req, query }) {
	const userResponse = await axios.get(`${SSR_SITE_URL + UserApiEndpoint}`, {
		headers: {
			cookie: req.headers.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const userData = userResponse?.data ?? null;
	const userStatus = userResponse?.status ?? null;

	// Sites response
	const sitesResponse = await axios.get(`${SSR_SITE_URL + SitesApiEndpoint}`, {
		headers: {
			cookie: req?.headers?.cookie ?? null,
			...customAxiosHeaders
		}
	});
	const sitesData = sitesResponse?.data ?? null;
	const sitesStatus = sitesResponse?.status ?? null;

	if (
		typeof userData !== "undefined" &&
		userData !== null &&
		!userData?.detail &&
		Object.keys(userData)?.length > 0 &&
		Math.round(userStatus / 200) === 1
	) {
		const sid = query?.sid ?? null;

		if (
			typeof sitesData !== "undefined" &&
			sitesData !== null &&
			!sitesData?.detail &&
			Object.keys(sitesData)?.length > 0 &&
			Math.round(sitesStatus / 200) === 1
		) {
			const sidMatch = sitesData?.results?.find((site) => site.id === sid) ?? null;

			if (sidMatch == null || sid == null) {
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

export default function SiteOverview() {
	const [siteName, setSiteName] = useState(null);
	const { sites, errorSites, validatingSites } = useSites();

	// Router
	const { query } = useRouter();
	const router = useRouter();

	// Handle selected site details
	const handleSiteDetails = useCallback(async () => {
		if (!validatingSites) {
			if (
				!errorSites &&
				sites !== null &&
				!sites?.detail &&
				Object.keys(sites)?.length > 0 &&
				Math.round(sites?.status / 200) === 1
			) {
				const sid = query?.sid ?? null;
				const siteMatch = sites?.results?.find((site) => site.id === sid) ?? null;

				if (sid == null || siteMatch == null) {
					router.replace(DashboardSitesLink, undefined, {});
				} else {
					setSiteName(siteMatch?.name ?? null);
				}
			}
		}
	}, [query, sites, errorSites, validatingSites]);

	useEffect(() => {
		handleSiteDetails();
	}, [handleSiteDetails]);

	// Translations
	const { t } = useTranslation("site");
	const siteOverviewName = t("site", { siteName });

	return (
		<>
			<NextSeo title={siteOverviewName} />
			<MemoizedPageLayout pageTitle={siteOverviewName}>
				<MemoizedComingSoonPageLayout />
				{/* <MemoizedSiteOverviewPageLayout /> */}
			</MemoizedPageLayout>
		</>
	);
}

SiteOverview.getLayout = function getLayout(page) {
	return <DashboardLayout>{page}</DashboardLayout>;
};
