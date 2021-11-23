import { SitesApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @returns {object} data, error, isValidating
 */
export const useSites = (endpoint = null) => {
	const {
		data: sites,
		error: errorSites,
		isValidating: validatingSites
	} = useSWR(typeof endpoint !== "undefined" && endpoint !== null && endpoint !== "" ? endpoint : SitesApiEndpoint);

	return { sites, errorSites, validatingSites };
};
