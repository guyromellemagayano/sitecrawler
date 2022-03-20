import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `links` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} links, errorLinks, validatingLinks
 */
export const useLinks = (endpoint = null, options = null) => {
	// SWR hook
	const { data: links, error: errorLinks, isValidating: validatingLinks } = useMainSWRConfig(endpoint, options);

	return { links, errorLinks, validatingLinks };
};
