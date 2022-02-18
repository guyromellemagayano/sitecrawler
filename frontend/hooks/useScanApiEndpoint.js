import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, perPageQuery } from "@constants/GlobalValues";
import { useRouter } from "next/router";

/**
 * Custom hook that handle the scan API endpoint changes
 *
 * @param {number} linksPerPage The number of links per page
 * @returns {string} The updated scan API endpoint
 */
export const useScanApiEndpoint = (linksPerPage = null) => {
	// Custom variables
	let scanApiEndpoint = SitesApiEndpoint + "?" + perPageQuery + linksPerPage + "&" + orderingByNameQuery + "name";
	let queryString = "";

	// Router
	const { query } = useRouter();

	const verifiedQuery = query?.verified
		? scanApiEndpoint.includes("?")
			? `&verified=${query.verified}`
			: `?verified=${query.verified}`
		: "";

	const pageQuery = query?.page ? (scanApiEndpoint.includes("?") ? `&page=${query.page}` : `?page=${query.page}`) : "";

	const searchQuery = query?.search
		? scanApiEndpoint.includes("?")
			? `&search=${query.search}`
			: `?search=${query.search}`
		: "";

	const orderingQuery = query?.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${query.ordering}`
			: `?ordering=${query.ordering}`
		: "";

	queryString += verifiedQuery;
	queryString += pageQuery;
	queryString += searchQuery;
	queryString += orderingQuery;
	scanApiEndpoint += queryString;

	console.log(scanApiEndpoint);

	return { scanApiEndpoint };
};
