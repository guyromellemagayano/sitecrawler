import { useSWRConfig } from "swr";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} pageId, errorPageId, validatingPageId
 */
export const usePageId = (endpoint = null, setConfig, options = null) => {
	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hook
	const {
		data: pageId,
		error: errorPageId,
		isValidating: validatingPageId
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { pageId, errorPageId, validatingPageId };
};
