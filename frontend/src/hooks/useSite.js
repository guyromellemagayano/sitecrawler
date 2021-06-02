// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const siteApiEndpoint = "/api/site/";

export const useSite = ({ endpoint, refreshInterval = 0 }) => {
	const {
		data: site,
		mutate: mutateSite,
		error: siteError
	} = useSWR(endpoint ? endpoint : null, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval
	});

	return { site, mutateSite, siteError };
};

export const useSiteId = ({ querySid = 0, refreshInterval = 0 }) => {
	const {
		data: siteId,
		mutate: mutateSiteId,
		error: siteIdError
	} = useSWR(
		() => (querySid && querySid !== 0 && querySid !== undefined ? siteApiEndpoint + querySid + "/" : null),
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
				? siteApiEndpoint + querySid + "/scan/?ordering=-finished_at"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/?ordering=-finished_at") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
			refreshInterval: refreshInterval
		}
	);

	return { links, mutateLinks, linksError };
};

export const useImages = ({ endpoint, querySid = 0, scanObjId = 0, refreshInterval = 0 }) => {
	const {
		data: images,
		mutate: mutateImages,
		error: imagesError
	} = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? endpoint
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === endpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/" + linkId) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			}
		}
	);

	return { pageDetail, mutatePageDetail, pageDetailError };
};

export const usePageDetailLink = ({ addQuery = "", querySid = 0, scanObjId = 0, linkId = 0 }) => {
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
			linkId &&
			linkId !== 0 &&
			linkId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/link/" + addQuery
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/" + linkId + "/link/" + addQuery) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/" + linkId
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, revalidate, { retryCount }) => {
				if (error && error !== undefined && error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/" + linkId) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			}
		}
	);

	return { imageDetail, mutateImageDetail, imageDetailError };
};
