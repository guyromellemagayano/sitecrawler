// NextJS
import { useRouter } from "next/router";

// External
import useSWR from "swr";

// Hooks
import { RevalidationInterval } from "@enums/GlobalValues";
import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";

export const useSite = ({ endpoint, refreshInterval = 0 }) => {
	const {
		data: site,
		mutate: mutateSite,
		error: siteError
	} = useSWR(endpoint ? endpoint : null, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error !== undefined && error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		refreshInterval: refreshInterval
	});

	return { site, mutateSite, siteError };
};

export const useSiteId = ({
	querySid = 0,
	redirectIfFound = false,
	redirectTo = "",
	refreshInterval = 0
}) => {
	const router = useRouter();

	const {
		data: siteId,
		mutate: mutateSiteId,
		error: siteIdError
	} = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined
				? SiteApiEndpoint + querySid + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			onSuccess: (data) => {
				if (data !== undefined) {
					if (data?.verified == false && data?.last_finished_scan_id !== null && !redirectIfFound) {
						return;
					} else if (
						data?.verified == true &&
						data?.last_finished_scan_id == null &&
						!redirectIfFound
					) {
						return;
					} else if (
						data?.verified == true &&
						data?.last_finished_scan_id !== null &&
						!redirectIfFound
					) {
						return;
					} else {
						router.push({ pathname: redirectTo });
					}
				} else {
					router.push({ pathname: redirectTo });
				}
			},
			refreshInterval: refreshInterval
		}
	);

	return { siteId, mutateSiteId, siteIdError };
};

export const useScan = ({ querySid = 0, refreshInterval = 0 }) => {
	const {
		data: scan,
		mutate: mutateScan,
		error: scanError
	} = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined
				? SiteApiEndpoint + querySid + "/scan/?ordering=-finished_at"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/scan/?ordering=-finished_at") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { scan, mutateScan, scanError };
};

export const useStats = ({ querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: stats,
		mutate: mutateStats,
		error: statsError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { stats, mutateStats, statsError };
};

export const useLinks = ({ endpoint, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: links,
		mutate: mutateLinks,
		error: linksError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { links, mutateLinks, linksError };
};

export const useUptime = ({ querySid = 0, refreshInterval = 0 }) => {
	const uptimeApiEndpoint = `/api/site/${querySid}/uptime/`;

	const {
		data: uptime,
		mutate: mutateUptime,
		error: uptimeError
	} = useSWR(
		() => (querySid && querySid !== 0 && querySid !== undefined ? uptimeApiEndpoint : null),
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === uptimeApiEndpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { uptime, mutateUptime, uptimeError };
};

export const useUptimeSummary = ({ querySid = 0, refreshInterval = 0 }) => {
	const uptimeSummaryApiEndpoint = `/api/site/${querySid}/uptime/summary/`;

	const {
		data: uptimeSummary,
		mutate: mutateUptimeSummary,
		error: uptimeSummaryError
	} = useSWR(
		() => (querySid && querySid !== 0 && querySid !== undefined ? uptimeSummaryApiEndpoint : null),
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === uptimeSummaryApiEndpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { uptimeSummary, mutateUptimeSummary, uptimeSummaryError };
};

export const useImages = ({ endpoint, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: images,
		mutate: mutateImages,
		error: imagesError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { images, mutateImages, imagesError };
};

export const usePages = ({ endpoint, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: pages,
		mutate: mutatePages,
		error: pagesError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			},
			refreshInterval: refreshInterval
		}
	);

	return { pages, mutatePages, pagesError };
};

export const useLinkDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: linkDetail,
		mutate: mutateLinkDetail,
		error: linkDetailError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined &&
			linkId &&
			linkId !== 0 &&
			linkId !== undefined
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			}
		}
	);

	return { linkDetail, mutateLinkDetail, linkDetailError };
};

export const usePageDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: pageDetail,
		mutate: mutatePageDetail,
		error: pageDetailError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined &&
			linkId &&
			linkId !== 0 &&
			linkId !== undefined
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/")
					return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			}
		}
	);

	return { pageDetail, mutatePageDetail, pageDetailError };
};

export const usePageDetailLink = ({ addQuery = "", querySid = 0, scanObjId = 0, pageId = 0 }) => {
	const {
		data: pageDetailLink,
		mutate: mutatePageDetailLink,
		error: pageDetailLinkError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined &&
			pageId &&
			pageId !== 0 &&
			pageId !== undefined
				? SiteApiEndpoint +
				  querySid +
				  "/scan/" +
				  scanObjId +
				  "/page/" +
				  pageId +
				  "/link/" +
				  "?" +
				  addQuery +
				  ""
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (
					key ===
					SiteApiEndpoint +
						querySid +
						"/scan/" +
						scanObjId +
						"/page/" +
						pageId +
						"/link/" +
						"?" +
						addQuery +
						""
				)
					return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			}
		}
	);

	return { pageDetailLink, mutatePageDetailLink, pageDetailLinkError };
};

export const useImageDetail = ({ querySid = 0, scanObjId = 0, linkId = 0 }) => {
	const {
		data: imageDetail,
		mutate: mutateImageDetail,
		error: imageDetailError
	} = useSWR(
		() =>
			querySid &&
			querySid !== 0 &&
			querySid !== undefined &&
			scanObjId &&
			scanObjId !== 0 &&
			scanObjId !== undefined &&
			linkId &&
			linkId !== 0 &&
			linkId !== undefined
				? SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/" + linkId + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error !== undefined && error.status === 404) return;
				if (key === SiteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/" + linkId + "/")
					return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
			}
		}
	);

	return { imageDetail, mutateImageDetail, imageDetailError };
};
