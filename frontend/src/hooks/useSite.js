// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const siteApiEndpoint = "/api/site/";

export const useSite = ({ endpoint, refreshInterval = 0 }) => {
	const { data: site, mutate: mutateSite, error: siteError } = useSWR(endpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval,
	});

	return { site, mutateSite, siteError };
};

export const useSiteId = ({ querySid = 0 }) => {
	const { data: siteId, mutate: mutateSiteId, error: siteIdError } = useSWR(
		() => (querySid && querySid !== 0 && querySid !== undefined ? siteApiEndpoint + querySid + "/" : null),
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { siteId, mutateSiteId, siteIdError };
};

export const useScan = ({ querySid = 0 }) => {
	const { data: scan, mutate: mutateScan, error: scanError } = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined
				? siteApiEndpoint + querySid + "/scan/?ordering=-finished_at/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/?ordering=-finished_at/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { scan, mutateScan, scanError };
};

export const useStats = ({ querySid = 0, scanObjId = 0 }) => {
	const { data: stats, mutate: mutateStats, error: statsError } = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { stats, mutateStats, statsError };
};

export const useLinks = ({ querySid = 0, scanObjId = 0 }) => {
	const { data: links, mutate: mutateLinks, error: linksError } = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/link/") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { links, mutateLinks, linksError };
};

export const useImages = ({ querySid = 0, scanObjId = 0 }) => {
	const { data: images, mutate: mutateImages, error: imagesError } = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/?tls_status=NONE&tls_status=ERROR"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/image/?tls_status=NONE&tls_status=ERROR")
					return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { images, mutateImages, imagesError };
};

export const useNonTlsPages = ({ querySid = 0, scanObjId = 0 }) => {
	const { data: nonTlsPages, mutate: mutateNonTlsPages, error: nonTlsPagesError } = useSWR(
		() =>
			querySid && querySid !== 0 && querySid !== undefined && scanObjId && scanObjId !== 0 && scanObjId !== undefined
				? siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/?tls_total=false"
				: null,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === siteApiEndpoint + querySid + "/scan/" + scanObjId + "/page/?tls_total=false") return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
		}
	);

	return { nonTlsPages, mutateNonTlsPages, nonTlsPagesError };
};
