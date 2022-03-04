import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} page, errorPage, validatingPage
 */
export const usePage = (endpoint = null, options = null) => {
	const [pageCount, setPageCount] = useState(0);
	const [pageResults, setPageResults] = useState([]);

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint = endpoint !== null && typeof endpoint === "string" && endpoint !== "" ? endpoint : null;

	// SWR hook
	const { data: page, error: errorPage, isValidating: validatingPage } = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorPage) {
			// Show alert message after failed `user` SWR hook fetch
			errorPage
				? setConfig({
						isPage: true,
						method: errorPage?.config?.method ?? null,
						status: errorPage?.status ?? null
				  })
				: null;
		}
	}, [errorPage]);

	useMemo(async () => {
		if (page?.data) {
			if (page.data?.count) {
				setPageCount(page.data.count);
			}

			if (page.data?.results) {
				setPageResults(page.data.results);
			}
		}

		return { pageCount, pageResults };
	}, [page, pageCount, pageResults]);

	return { page, errorPage, validatingPage, pageCount, pageResults };
};
