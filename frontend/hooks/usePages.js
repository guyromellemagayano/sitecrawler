import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} pages, errorPages, validatingPages
 */
export const usePages = (endpoint = null, querySid = null, scanObjId = null) => {
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

	const { data: pages, error: errorPages, isValidating: validatingPages } = useMainSWRConfig(currentEndpoint);

	return { pages, errorPages, validatingPages };
};
