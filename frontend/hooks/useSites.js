import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} sites, errorSites, validatingSites
 */
export const useSites = (endpoint = null, options = null) => {
	// SWR hook
	const { data: sites, error: errorSites, isValidating: validatingSites } = useMainSWRConfig(endpoint, options);

	return { sites, errorSites, validatingSites };
};
