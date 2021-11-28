import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page` information
 *
 * @param {string} endpoint
 * @returns {object} page, errorPage, validatingPage
 */
export const usePage = (endpoint = null) => {
	const currentEndpoint =
		typeof endpoint !== "undefined" && endpoint !== null && typeof endpoint === "string" && endpoint !== ""
			? endpoint
			: null;

	const { data: page, error: errorPage, isValidating: validatingPage } = useMainSWRConfig(currentEndpoint);

	return { page, errorPage, validatingPage };
};
