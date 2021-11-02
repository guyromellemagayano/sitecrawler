import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useUser } from "./useUser";

export const useSite = ({ endpoint = null, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: site,
		mutate: mutateSite,
		error: errorSite,
		isValidating: validatingSite
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? endpoint !== null
				? endpoint
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { site, mutateSite, errorSite, validatingSite };
};

export const useSiteId = ({ querySid = 0, redirectIfFound = false, redirectTo = null, refreshInterval = 0 }) => {
	const router = useRouter();
	const { user } = useUser();

	const {
		data: siteId,
		mutate: mutateSiteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0
				? SiteApiEndpoint + querySid + "/"
				: null
			: null,
		useFetcher,
		{
			onSuccess: (data) => {
				data
					? (!data.verified && data.last_finished_scan_id !== null && !redirectIfFound) ||
					  (data.verified && data.last_finished_scan_id == null && !redirectIfFound) ||
					  (data.verified && data.last_finished_scan_id !== null && !redirectIfFound)
						? null
						: router.push({ pathname: redirectTo })
					: null;
			},
			refreshInterval: refreshInterval
		}
	);

	return { siteId, mutateSiteId, errorSiteId, validatingSiteId };
};

export const useScan = ({ querySid = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: scan,
		mutate: mutateScan,
		error: errorScan,
		isValidating: validatingScan
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0
				? SiteApiEndpoint + querySid + "/scan/?ordering=-finished_at"
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { scan, mutateScan, errorScan, validatingScan };
};

export const useStats = ({ querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: stats,
		mutate: mutateStats,
		error: errorStats,
		isValidating: validatingStats
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/"
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { stats, mutateStats, errorStats, validatingStats };
};

export const useLinks = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: links,
		mutate: mutateLinks,
		error: errorLinks,
		isValidating: validateLinks
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && endpoint !== null
				? endpoint
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { links, mutateLinks, errorLinks, validateLinks };
};

export const useUptime = ({ querySid = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: uptime,
		mutate: mutateUptime,
		error: errorUptime,
		isValidating: validatingUptime
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0
				? SiteApiEndpoint + querySid + "/uptime/"
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { uptime, mutateUptime, errorUptime, validatingUptime };
};

export const useUptimeSummary = ({ querySid = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: uptimeSummary,
		mutate: mutateUptimeSummary,
		error: errorUptimeSummary,
		isValidating: validatingUptimeSummaryError
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0
				? SiteApiEndpoint + querySid + "/uptime/summary/"
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { uptimeSummary, mutateUptimeSummary, errorUptimeSummary, validatingUptimeSummaryError };
};

export const useImages = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: images,
		mutate: mutateImages,
		error: errorImages,
		isValidating: validatingImages
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && endpoint !== null
				? endpoint
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { images, mutateImages, errorImages, validatingImages };
};

export const usePages = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const { user } = useUser();

	const {
		data: pages,
		mutate: mutatePages,
		error: errorPages,
		isValidating: validatingPages
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && endpoint !== null
				? endpoint
				: null
			: null,
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { pages, mutatePages, errorPages, validatingPages };
};

export const useLinkDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const { user } = useUser();

	const {
		data: linkDetail,
		mutate: mutateLinkDetail,
		error: errorLinkDetail,
		isValidating: validatingLinkDetail
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && linkId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId
				: null
			: null,
		useFetcher
	);

	return { linkDetail, mutateLinkDetail, errorLinkDetail, validatingLinkDetail };
};

export const usePageDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const { user } = useUser();

	const {
		data: pageDetail,
		mutate: mutatePageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && linkId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/"
				: null
			: null,
		useFetcher
	);

	return { pageDetail, mutatePageDetail, errorPageDetail, validatingPageDetail };
};

export const usePageDetailLink = ({ addQuery = "", querySid = 0, scanObjId = 0, pageId = 0 }) => {
	const { user } = useUser();

	const {
		data: pageDetailLink,
		mutate: mutatePageDetailLink,
		error: errorPageDetailLink,
		isValidating: validatingPageDetailLink
	} = useSWR(
		typeof user !== undefined && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? querySid !== 0 && scanObjId !== 0 && pageId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + pageId + "/link/" + addQuery !== ""
					? "?" + addQuery
					: ""
				: null
			: null,
		useFetcher
	);

	return { pageDetailLink, mutatePageDetailLink, errorPageDetailLink, validatingPageDetailLink };
};
