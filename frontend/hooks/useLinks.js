import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `links` information
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} links, errorLinks, validatingLinks
 */
export const useLinks = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: links,
		error: errorLinks,
		isValidating: validatingLinks
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { links, errorLinks, validatingLinks };
};
