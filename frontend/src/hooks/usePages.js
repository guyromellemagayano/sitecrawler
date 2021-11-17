import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `pages` information
 *
 * @param {string} endpoint
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} data, error, isValidating
 */
export const usePages = (endpoint = null, querySid = 0, scanObjId = 0) => {
	const {
		data: pages,
		error: errorPages,
		isValidating: validatingPages
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

	return { pages, errorPages, validatingPages };
};
