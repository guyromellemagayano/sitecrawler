import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a individual `site` information
 *
 * @param {number} querySid
 * @returns {object} data, error, isValidating
 */
export const useSiteId = (querySid = 0) => {
	const {
		data: siteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useSWR(
		typeof querySid !== "undefined" && querySid !== null && querySid !== 0 ? SiteApiEndpoint + querySid + "/" : null
	);

	return { siteId, errorSiteId, validatingSiteId };
};
