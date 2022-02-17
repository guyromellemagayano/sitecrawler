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

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (errorSites) {
				// Show alert message after failed `user` SWR hook fetch
				errorSites
					? setSitesConfig({
							isStats: true,
							method: errorSites?.config?.method ?? null,
							status: errorSites?.status ?? null
					  })
					: null;
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [errorSites]);

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (sites?.data) {
				if (sites.data?.count) {
					setSitesCount(sites.data.count);
				}

				if (sites.data?.results) {
					setSitesResults(sites.data.results);
				}
			}

			return { sitesResults, sitesCount };
		})();

		return () => {
			isMounted = false;
		};
	}, [sites]);

	return { sites, validatingSites, sitesResults, sitesCount };
};
