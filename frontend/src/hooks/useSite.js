// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

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
	const siteApiEndpoint = "/api/site/";

	const { data: siteId, error: siteIdError } = useSWR(siteApiEndpoint + querySid + "/", useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === siteApiEndpoint + querySid) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
	});

	return { siteId, siteIdError };
};
