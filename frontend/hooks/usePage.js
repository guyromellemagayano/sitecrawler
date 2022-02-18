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

	// Custom context
	const { setConfig: setPageConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint = endpoint !== null && typeof endpoint === "string" && endpoint !== "" ? endpoint : null;

	// SWR hook
	const { data: page, error: errorPage, isValidating: validatingPage } = useMainSWRConfig(currentEndpoint, options);

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (errorPage) {
				// Show alert message after failed `user` SWR hook fetch
				errorPage
					? setPageConfig({
							isPage: true,
							method: errorPage?.config?.method ?? null,
							status: errorPage?.status ?? null
					  })
					: null;
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [errorPage]);

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (page?.data) {
				if (page.data?.count) {
					setPageCount(page.data.count);
				}
			}

			return { pageCount };
		})();

		return () => {
			isMounted = false;
		};
	}, [page]);

	return { page, errorPage, validatingPage, pageCount };
};
