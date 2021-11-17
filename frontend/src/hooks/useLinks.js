import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `links` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} data, error, isValidating
 */
export const useLinks = (endpoint = null, querySid = 0, scanObjId = 0) => {
	const {
		data: links,
		error: errorLinks,
		isValidating: validateLinks
	} = useSWR(
		typeof querySid !== "undefined" &&
			querySid !== null &&
			querySid !== 0 &&
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId !== 0 &&
			typeof endpoint !== "undefined" &&
			endpoint !== null &&
			endpoint !== ""
			? endpoint
			: null
	);

	return { links, errorLinks, validateLinks };
};
