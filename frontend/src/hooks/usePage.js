import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `page` information
 *
 * @param {string} endpoint
 * @returns {object} data, error, isValidating
 */
export const usePage = (endpoint = null) => {
	const {
		data: page,
		error: errorPage,
		isValidating: validatingPage
	} = useSWR(typeof endpoint !== "undefined" && endpoint !== null && endpoint !== "" ? endpoint : null);

	return { page, errorPage, validatingPage };
};
