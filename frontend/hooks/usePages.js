import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {object} options
 * @returns {object} pages, errorPages, validatingPages, pagesResults, pagesCount
 */
export const usePages = (endpoint = null, querySid = null, scanObjId = null, options = null) => {
	const [pagesCount, setPagesCount] = useState(0);
	const [pagesResults, setPagesResults] = useState([]);

	// Custom context
	const { setConfig: setPagesConfig } = useContext(SiteCrawlerAppContext);

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
	const { data: pages, error: errorPages, isValidating: validatingPages } = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorPages) {
			// Show alert message after failed `user` SWR hook fetch
			errorPages
				? setPagesConfig({
						isPages: true,
						method: errorPages?.config?.method ?? null,
						status: errorPages?.status ?? null
				  })
				: null;
		}
	}, [errorPages]);

	useMemo(async () => {
		if (pages?.data) {
			if (pages.data?.count) {
				setPagesCount(pages.data.count);
			}

			if (pages.data?.results) {
				setPagesResults(pages.data.results);
			}
		}

		return { pagesResults, pagesCount };
	}, [pages, pagesResults, pagesCount]);

	return { pages, errorPages, validatingPages, pagesResults, pagesCount };
};
