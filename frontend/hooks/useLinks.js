import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `links` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} links, errorLinks, validatingLinks
 */
export const useLinks = (endpoint = null, querySid = null, scanObjId = null) => {
	const currentEndpoint =
		typeof endpoint !== "undefined" &&
		endpoint !== null &&
		typeof endpoint === "string" &&
		endpoint !== "" &&
		typeof querySid !== "undefined" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		typeof scanObjId !== "undefined" &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? endpoint
			: null;

	const { data: links, error: errorLinks, isValidating: validatingLinks } = useMainSWRConfig(currentEndpoint);

	return { links, errorLinks, validatingLinks };
};
