import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, sortByNameAscending } from "@constants/GlobalValues";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} sites, errorSites, validatingSites
 */
export const useSites = (endpoint = null, options = null) => {
	const [sitesCount, setSitesCount] = useState(0);
	const [sitesResults, setSitesResults] = useState([]);

	// Custom context
	const { setConfig: setSitesConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		endpoint !== null && typeof endpoint === "string" && endpoint !== ""
			? endpoint
			: SitesApiEndpoint + `?${orderingByNameQuery + sortByNameAscending}`;

	// SWR hook
	const { data: sites, error: errorSites, isValidating: validatingSites } = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorSites) {
			// Show alert message after failed `user` SWR hook fetch
			errorSites
				? setSitesConfig({
						isSites: true,
						method: errorSites?.config?.method ?? null,
						status: errorSites?.status ?? null
				  })
				: null;
		}
	}, [errorSites]);

	useMemo(async () => {
		if (sites?.data) {
			if (sites.data?.count) {
				setSitesCount(sites.data.count);
			} else {
				setSitesCount(0);
			}

			if (sites.data?.results) {
				setSitesResults(sites.data.results);
			} else {
				setSitesResults([]);
			}
		}

		return { sitesResults, sitesCount };
	}, [sites, sitesResults, sitesCount]);

	return { sites, validatingSites, sitesResults, sitesCount };
};
