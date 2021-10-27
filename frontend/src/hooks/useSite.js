import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";
import { useRouter } from "next/router";
import useSWR from "swr";

export const useSite = ({ endpoint = null, refreshInterval = 0 }) => {
	const {
		data: site,
		mutate: mutateSite,
		error: siteError,
		isValidating: validatingSite
	} = useSWR(endpoint !== null ? endpoint : null, useFetcher, {
		refreshInterval: refreshInterval
	});

	return { site, mutateSite, siteError, validatingSite };
};

export const useSiteId = ({ querySid = 0, redirectIfFound = false, redirectTo = null, refreshInterval = 0 }) => {
	const router = useRouter();

	const {
		data: siteId,
		mutate: mutateSiteId,
		error: siteIdError,
		isValidating: validatingSiteId
	} = useSWR(() => (querySid !== 0 ? SiteApiEndpoint + querySid + "/" : null), useFetcher, {
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
	});

	return { siteId, mutateSiteId, validatingSiteId, siteIdError };
};

export const useScan = ({ querySid = 0, refreshInterval = 0 }) => {
	const {
		data: scan,
		mutate: mutateScan,
		error: scanError,
		isValidating: validatingScan
	} = useSWR(() => (querySid !== 0 ? SiteApiEndpoint + querySid + "/scan/?ordering=-finished_at" : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { scan, mutateScan, validatingScan, scanError };
};

export const useStats = ({ querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: stats,
		mutate: mutateStats,
		error: statsError,
		isValidating: validatingStats
	} = useSWR(
		() => (querySid !== 0 && scanObjId !== 0 ? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/" : null),
		useFetcher,
		{
			refreshInterval: refreshInterval
		}
	);

	return { stats, mutateStats, validatingStats, statsError };
};

export const useLinks = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: links,
		mutate: mutateLinks,
		error: linksError,
		isValidating: validateLinks
	} = useSWR(() => (querySid !== 0 && scanObjId !== 0 && endpoint !== null ? endpoint : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { links, mutateLinks, validateLinks, linksError };
};

export const useUptime = ({ querySid = 0, refreshInterval = 0 }) => {
	const {
		data: uptime,
		mutate: mutateUptime,
		error: uptimeError,
		isValidating: validatingUptime
	} = useSWR(() => (querySid !== 0 ? SiteApiEndpoint + querySid + "/uptime/" : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { uptime, mutateUptime, validatingUptime, uptimeError };
};

export const useUptimeSummary = ({ querySid = 0, refreshInterval = 0 }) => {
	const {
		data: uptimeSummary,
		mutate: mutateUptimeSummary,
		error: uptimeSummaryError,
		isValidating: validatingUptimeSummaryError
	} = useSWR(() => (querySid !== 0 ? SiteApiEndpoint + querySid + "/uptime/summary/" : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { uptimeSummary, mutateUptimeSummary, validatingUptimeSummaryError, uptimeSummaryError };
};

export const useImages = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: images,
		mutate: mutateImages,
		error: imagesError,
		isValidating: validatingImages
	} = useSWR(() => (querySid !== 0 && scanObjId !== 0 && endpoint !== null ? endpoint : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { images, mutateImages, validatingImages, imagesError };
};

export const usePages = ({ endpoint = null, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: pages,
		mutate: mutatePages,
		error: pagesError,
		isValidating: validatingPages
	} = useSWR(() => (querySid !== 0 && scanObjId !== 0 && endpoint !== null ? endpoint : null), useFetcher, {
		refreshInterval: refreshInterval
	});

	return { pages, mutatePages, validatingPages, pagesError };
};

export const useLinkDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: linkDetail,
		mutate: mutateLinkDetail,
		error: linkDetailError,
		isValidating: validatingLinkDetail
	} = useSWR(
		() =>
			querySid !== 0 && scanObjId !== 0 && linkId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId
				: null,
		useFetcher
	);

	return { linkDetail, mutateLinkDetail, validatingLinkDetail, linkDetailError };
};

export const usePageDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: pageDetail,
		mutate: mutatePageDetail,
		error: pageDetailError,
		isValidating: validatingPageDetail
	} = useSWR(
		() =>
			querySid !== 0 && scanObjId !== 0 && linkId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/"
				: null,
		useFetcher
	);

	return { pageDetail, mutatePageDetail, validatingPageDetail, pageDetailError };
};

export const usePageDetailLink = ({ addQuery = "", querySid = 0, scanObjId = 0, pageId = 0 }) => {
	const {
		data: pageDetailLink,
		mutate: mutatePageDetailLink,
		error: pageDetailLinkError,
		isValidating: validatingPageDetailLink
	} = useSWR(
		() =>
			querySid !== 0 && scanObjId !== 0 && pageId !== 0
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + pageId + "/link/" + addQuery !== ""
					? "?" + addQuery
					: ""
				: null,
		useFetcher
	);

	return { pageDetailLink, mutatePageDetailLink, validatingPageDetailLink, pageDetailLinkError };
};
