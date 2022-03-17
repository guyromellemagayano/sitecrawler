import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a individual `site` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} siteId, errorSiteId, validatingSiteId
 */
export const useSiteId = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: siteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { siteId, errorSiteId, validatingSiteId };
};
