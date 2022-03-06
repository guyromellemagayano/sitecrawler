import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `links` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {object} options
 * @returns {object} links, errorLinks, validatingLinks, linksResults, linksCount
 */
export const useLinks = (endpoint = null, querySid = null, scanObjId = null, options = null) => {
	const [linksCount, setLinksCount] = useState(0);
	const [linksResults, setLinksResults] = useState([]);

	// Custom context
	const { setConfig: setLinksConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		endpoint !== null &&
		typeof endpoint === "string" &&
		endpoint !== "" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? endpoint
			: null;

	// SWR hook
	const { data: links, error: errorLinks, isValidating: validatingLinks } = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorLinks) {
			// Show alert message after failed `links` SWR hook fetch
			errorLinks
				? setLinksConfig({
						isLinks: true,
						method: errorLinks?.config?.method ?? null,
						status: errorLinks?.status ?? null
				  })
				: null;
		}
	}, [errorLinks]);

	useMemo(async () => {
		if (Math.round(links?.status / 100) === 2 && links?.data && !links?.data?.detail) {
			if (links.data?.count) {
				setLinksCount(links.data.count);
			}

			if (links.data?.results) {
				setLinksResults(links.data.results);
			}
		}

		return { linksResults, linksCount };
	}, [links, linksResults, linksCount]);

	return { links, errorLinks, validatingLinks, linksResults, linksCount };
};
