import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} pages, errorPages, validatingPages
 */
export const usePages = (endpoint = null, options = null) => {
	// SWR hook
	const { data: pages, error: errorPages, isValidating: validatingPages } = useMainSWRConfig(endpoint, options);

	return { pages, errorPages, validatingPages };
};
