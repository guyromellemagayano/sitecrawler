import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} pageId, errorPageId, validatingPageId
 */
export const usePageId = (endpoint = null, options = null) => {
	// SWR hook
	const { data: pageId, error: errorPageId, isValidating: validatingPageId } = useMainSWRConfig(endpoint, options);

	return { pageId, errorPageId, validatingPageId };
};
