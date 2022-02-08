import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, sortByNameAscending } from "@constants/GlobalValues";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} sites, errorSites, validatingSites
 */
export const useSites = (endpoint = null, options = null) => {
	const currentEndpoint =
		endpoint !== null && typeof endpoint === "string" && endpoint !== ""
			? endpoint
			: SitesApiEndpoint + `?${orderingByNameQuery + sortByNameAscending}`;

	const { data: sites, error: errorSites, isValidating: validatingSites } = useMainSWRConfig(currentEndpoint, options);

	return { sites, errorSites, validatingSites };
};
