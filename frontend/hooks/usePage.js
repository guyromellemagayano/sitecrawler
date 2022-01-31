import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} page, errorPage, validatingPage
 */
export const usePage = (endpoint = null, options = null) => {
	const currentEndpoint = endpoint !== null && typeof endpoint === "string" && endpoint !== "" ? endpoint : null;

	const { data: page, error: errorPage, isValidating: validatingPage } = useMainSWRConfig(currentEndpoint, options);

	return { page, errorPage, validatingPage };
};
