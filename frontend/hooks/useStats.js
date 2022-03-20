import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's crawl `stats` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} stats, errorStats, validatingStats
 */
export const useStats = (endpoint = null, options = null) => {
	// SWR hook
	const { data: stats, error: errorStats, isValidating: validatingStats } = useMainSWRConfig(endpoint, options);

	return { stats, errorStats, validatingStats };
};
