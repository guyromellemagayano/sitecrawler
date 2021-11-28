import { SitesApiEndpoint } from "@configs/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @returns {object} sites, errorSites, validatingSites
 */
export const useSites = (endpoint = null) => {
	const currentEndpoint =
		typeof endpoint !== "undefined" && endpoint !== null && typeof endpoint === "string" && endpoint !== ""
			? endpoint
			: SitesApiEndpoint;

	const { data: sites, error: errorSites, isValidating: validatingSites } = useMainSWRConfig(currentEndpoint);

	return { sites, errorSites, validatingSites };
};
