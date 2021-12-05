import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, perPageQuery } from "@constants/GlobalValues";

/**
 * Custom hook that handle the scan API endpoint changes
 *
 * @param {object} result The result query if there is any
 * @param {number} linksPerPage The number of links per page
 * @returns {string} The updated scan API endpoint
 */
export const useScanApiEndpoint = (result = null, linksPerPage = null) => {
	let scanApiEndpoint = SitesApiEndpoint + "?" + perPageQuery + linksPerPage + "&" + orderingByNameQuery + "name";
	let queryString = "";

	queryString +=
		typeof result?.page !== "undefined"
			? scanApiEndpoint.includes("?")
				? `&page=${result?.page}`
				: `?page=${result?.page}`
			: "";

	queryString += result?.search
		? scanApiEndpoint.includes("?")
			? `&search=${result?.search}`
			: `?search=${result?.search}`
		: "";

	queryString += result?.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${result?.ordering}`
			: `?ordering=${result?.ordering}`
		: "";

	scanApiEndpoint += queryString;

	return { scanApiEndpoint };
};
