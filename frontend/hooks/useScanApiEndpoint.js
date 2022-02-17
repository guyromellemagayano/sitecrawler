import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, perPageQuery } from "@constants/GlobalValues";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Custom hook that handle the scan API endpoint changes
 *
 * @param {number} linksPerPage The number of links per page
 * @returns {string} The updated scan API endpoint
 */
export const useScanApiEndpoint = (linksPerPage = null, filterType = null) => {
	// Custom variables
	let scanApiEndpoint = SitesApiEndpoint + "?" + perPageQuery + linksPerPage + "&" + orderingByNameQuery + "name";
	let queryString = "";

	// Router
	const { query } = useRouter();

	useEffect(() => {
		if (filterType !== null) {
			// Sites filter
			if (filterType === "sites") {
				scanApiEndpoint = SitesApiEndpoint + "?" + perPageQuery + linksPerPage + "&" + orderingByNameQuery + "name";

				console.log(scanApiEndpoint);

				queryString +=
					typeof query?.verified !== "undefined" && query?.verified !== null
						? scanApiEndpoint.includes("?")
							? `&verified=${query.verified}`
							: `?verified=${query.verified}`
						: "";
			}
		}
	}, [filterType, linksPerPage]);

	const pageQuery =
		typeof query?.page !== "undefined" && query?.page !== null
			? scanApiEndpoint.includes("?")
				? `&page=${query.page}`
				: `?page=${query.page}`
			: null;

	const searchQuery =
		typeof query?.search !== "undefined" && query?.search !== null
			? scanApiEndpoint.includes("?")
				? `&search=${query.search}`
				: `?search=${query.search}`
			: null;

	const orderingQuery =
		typeof query?.ordering !== "undefined" && query?.ordering !== null
			? scanApiEndpoint.includes("?")
				? `&ordering=${query.ordering}`
				: `?ordering=${query.ordering}`
			: null;

	pageQuery !== null ? (queryString += pageQuery) : null;
	searchQuery !== null ? (queryString += searchQuery) : null;
	orderingQuery !== null ? (queryString += orderingQuery) : null;

	scanApiEndpoint += queryString;

	return { scanApiEndpoint };
};
