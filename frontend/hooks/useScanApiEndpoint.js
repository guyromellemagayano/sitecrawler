import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, perPageQuery } from "@constants/GlobalValues";
import { ScanSlug, SiteImagesSlug, SiteLinksSlug } from "@constants/PageLinks";
import { handleConversionStringToNumber } from "@utils/convertCase";
import { useRouter } from "next/router";
import { useScan } from "./useScan";

/**
 * Custom hook that handle the scan API endpoint changes
 *
 * @param {number} linksPerPage The number of links per page
 * @returns {string} The updated scan API endpoint
 */
export const useScanApiEndpoint = (linksPerPage = null) => {
	// Router
	const { asPath, query } = useRouter();
	const { siteId } = query;

	// Site `scan` SWR hook
	const { scanObjId } = useScan(siteId, {
		revalidateOnFocus: false
	});

	// Custom variables
	let scanApiEndpoint = "";
	let queryString = "";

	if (asPath.includes(SiteImagesSlug)) {
		scanApiEndpoint =
			SitesApiEndpoint +
			handleConversionStringToNumber(siteId) +
			ScanSlug +
			scanObjId +
			SiteLinksSlug +
			"?" +
			perPageQuery +
			linksPerPage +
			"&" +
			orderingByNameQuery +
			"name";
	} else {
		scanApiEndpoint = SitesApiEndpoint + "?" + perPageQuery + linksPerPage + "&" + orderingByNameQuery + "name";
	}

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

	return { scanApiEndpoint };
};
