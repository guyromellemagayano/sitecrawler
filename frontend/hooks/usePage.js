import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} page, errorPage, validatingPage
 */
export const usePage = (endpoint = null, options = null) => {
	// SWR hook
	const { data: page, error: errorPage, isValidating: validatingPage } = useMainSWRConfig(endpoint, options);

	return { page, errorPage, validatingPage };
};
