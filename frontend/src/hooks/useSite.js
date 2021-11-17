import useSWR from "swr";

/**
 * SWR React hook that will handle all the registered `sites` information
 *
 * @param {string} endpoint
 * @returns {object} data, error, isValidating
 */
export const useSite = (endpoint = null) => {
	const {
		data: site,
		error: errorSite,
		isValidating: validatingSite
	} = useSWR(typeof endpoint !== "undefined" && endpoint !== null && endpoint !== "" ? endpoint : null);

	return { site, errorSite, validatingSite };
};
