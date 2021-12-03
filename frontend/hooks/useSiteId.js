import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a individual `site` information
 *
 * @param {number} querySid
 * @returns {object} siteId, errorSiteId, validatingSiteId
 */
export const useSiteId = (querySid = null) => {
	const currentEndpoint =
		typeof querySid !== "undefined" && querySid !== null && querySid > 0 ? SitesApiEndpoint + querySid + "/" : null;

	const { data: siteId, error: errorSiteId, isValidating: validatingSiteId } = useMainSWRConfig(currentEndpoint);

	return { siteId, errorSiteId, validatingSiteId };
};
