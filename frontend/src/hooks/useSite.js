import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useUser } from "./useUser";

export const useSite = ({ endpoint = null }) => {
	const {
		data: site,
		mutate: mutateSite,
		error: errorSite,
		isValidating: validatingSite
	} = useSWR(endpoint ?? null, useFetcher);

	return { site, mutateSite, errorSite, validatingSite };
};

export const useSiteId = ({ querySid = 0, redirectIfFound = false, redirectTo = null }) => {
	const router = useRouter();

	const {
		data: siteId,
		mutate: mutateSiteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useSWR(querySid !== 0 ? SiteApiEndpoint + querySid + "/" : null, useFetcher, {
		onSuccess: (data) => {
			data
				? (!data.verified && data.last_finished_scan_id !== null && !redirectIfFound) ||
				  (data.verified && data.last_finished_scan_id == null && !redirectIfFound) ||
				  (data.verified && data.last_finished_scan_id !== null && !redirectIfFound)
					? null
					: router.push({ pathname: redirectTo })
				: null;
		}
	});

	return { siteId, mutateSiteId, errorSiteId, validatingSiteId };
};

export const useScan = ({ querySid = 0 }) => {
	const {
		data: scan,
		mutate: mutateScan,
		error: errorScan,
		isValidating: validatingScan
	} = useSWR(querySid !== 0 ? SiteApiEndpoint + querySid + "/scan/?ordering=-finished_at" : null, useFetcher);

	return { scan, mutateScan, errorScan, validatingScan };
};

export const useStats = ({ querySid = 0, scanObjId = 0 }) => {
	const {
		data: stats,
		mutate: mutateStats,
		error: errorStats,
		isValidating: validatingStats
	} = useSWR(
		querySid !== 0 && scanObjId !== 0 ? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/" : null,
		useFetcher
	);

	return { stats, mutateStats, errorStats, validatingStats };
};

export const useLinks = ({ endpoint = null, querySid = 0, scanObjId = 0 }) => {
	const {
		data: links,
		mutate: mutateLinks,
		error: errorLinks,
		isValidating: validateLinks
	} = useSWR(querySid !== 0 && scanObjId !== 0 && typeof endpoint !== "null" ? endpoint : null, useFetcher);

	return { links, mutateLinks, errorLinks, validateLinks };
};

export const useUptime = ({ querySid = 0 }) => {
	const { user } = useUser();

	const {
		data: uptime,
		mutate: mutateUptime,
		error: errorUptime,
		isValidating: validatingUptime
	} = useSWR(querySid !== 0 ? SiteApiEndpoint + querySid + "/uptime/" : null, useFetcher);

	return { uptime, mutateUptime, errorUptime, validatingUptime };
};

export const useUptimeSummary = ({ querySid = 0 }) => {
	const {
		data: uptimeSummary,
		mutate: mutateUptimeSummary,
		error: errorUptimeSummary,
		isValidating: validatingUptimeSummaryError
	} = useSWR(querySid !== 0 ? SiteApiEndpoint + querySid + "/uptime/summary/" : null, useFetcher);

	return { uptimeSummary, mutateUptimeSummary, errorUptimeSummary, validatingUptimeSummaryError };
};

export const useImages = ({ endpoint = null, querySid = 0, scanObjId = 0 }) => {
	const {
		data: images,
		mutate: mutateImages,
		error: errorImages,
		isValidating: validatingImages
	} = useSWR(querySid !== 0 && scanObjId !== 0 && endpoint !== null ? endpoint : null, useFetcher);

	return { images, mutateImages, errorImages, validatingImages };
};

export const usePages = ({ endpoint = null, querySid = 0, scanObjId = 0 }) => {
	const {
		data: pages,
		mutate: mutatePages,
		error: errorPages,
		isValidating: validatingPages
	} = useSWR(querySid !== 0 && scanObjId !== 0 && endpoint !== null ? endpoint : null, useFetcher);

	return { pages, mutatePages, errorPages, validatingPages };
};

export const usePageDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: pageDetail,
		mutate: mutatePageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useSWR(
		querySid !== 0 && scanObjId !== 0 && linkId !== 0
			? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/"
			: null,
		useFetcher
	);

	return { pageDetail, mutatePageDetail, errorPageDetail, validatingPageDetail };
};

export const usePageDetailLink = ({ addQuery = "", querySid = 0, scanObjId = 0, pageId = 0 }) => {
	const {
		data: pageDetailLink,
		mutate: mutatePageDetailLink,
		error: errorPageDetailLink,
		isValidating: validatingPageDetailLink
	} = useSWR(
		querySid !== 0 && scanObjId !== 0 && pageId !== 0
			? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + pageId + "/link/" + addQuery !== ""
				? "?" + addQuery
				: ""
			: null,
		useFetcher
	);

	return { pageDetailLink, mutatePageDetailLink, errorPageDetailLink, validatingPageDetailLink };
};
