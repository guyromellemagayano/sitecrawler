import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery, perPageQuery } from "@constants/GlobalValues";
import { ScanSlug, SiteLinkSlug, SiteLinksSlug } from "@constants/PageLinks";
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

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Site `scan` SWR hook
	const { scan, scanObjId } = useScan(sanitizedSiteId);

	// Custom variables
	let scanApiEndpoint = SitesApiEndpoint;
	let queryString = "";

	if (asPath.includes(SiteLinksSlug)) {
		scanApiEndpoint += sanitizedSiteId + ScanSlug + scanObjId + SiteLinkSlug;
	}

	scanApiEndpoint += "?" + perPageQuery + linksPerPage;

	const typeString = query?.type ? (Array.isArray(query?.type) ? query.type.join("&type=") : query.type) : "";

	// Sites
	const verifiedQuery = query?.verified
		? scanApiEndpoint.includes("?")
			? `&verified=${query.verified}`
			: `?verified=${query.verified}`
		: "";

	// Links
	const statusNeqQuery = query?.status__neq
		? scanApiEndpoint.includes("?")
			? `&status__neq=${query.status__neq}`
			: `?status__neq=${query.status__neq}`
		: "";

	const statusQuery = query?.status
		? scanApiEndpoint.includes("?")
			? `&status=${query.status}`
			: `?status=${query.status}`
		: "";

	const typeQuery = typeString ? (scanApiEndpoint.includes("?") ? `&type=${typeString}` : `?type=${typeString}`) : "";

	// Pages
	const sizeTotalMinQuery = query?.size_total_min
		? scanApiEndpoint.includes("?")
			? `&size_total_min=1048576`
			: `?size_total_min=1048576`
		: "";

	const sizeTotalMaxQuery = query?.size_total_max
		? scanApiEndpoint.includes("?")
			? `&size_total_max=1048575`
			: `?size_total_max=1048575`
		: "";

	const tlsTotalQuery = query?.tls_total
		? query.tls_total === "true"
			? scanApiEndpoint.includes("?")
				? `&tls_total=true`
				: `?tls_total=true`
			: scanApiEndpoint.includes("?")
			? `&tls_total=false`
			: `?tls_total=false`
		: "";

	const hasDuplicatedTitleQuery = query?.has_duplicated_title
		? query.has_duplicated_title
			? scanApiEndpoint.includes("?")
				? `&has_duplicated_title=true`
				: `?has_duplicated_title=true`
			: scanApiEndpoint.includes("?")
			? `&has_duplicated_title=false`
			: `?has_duplicated_title=false`
		: "";

	const hasDuplicatedDescriptionQuery = query?.has_duplicated_description
		? query.has_duplicated_description
			? scanApiEndpoint.includes("?")
				? `&has_duplicated_description=true`
				: `?has_duplicated_description=true`
			: scanApiEndpoint.includes("?")
			? `&has_duplicated_description=false`
			: `?has_duplicated_description=false`
		: "";

	// Pagination
	const pageQuery = query?.page ? (scanApiEndpoint.includes("?") ? `&page=${query.page}` : `?page=${query.page}`) : "";

	// Search
	const searchQuery = query?.search
		? scanApiEndpoint.includes("?")
			? `&search=${query.search}`
			: `?search=${query.search}`
		: "";

	// Sorting
	const orderingQuery = query?.ordering
		? scanApiEndpoint.includes("?")
			? `&ordering=${query.ordering}`
			: `?ordering=${query.ordering}`
		: "&" + orderingByNameQuery + "name";

	queryString += verifiedQuery;
	queryString += statusNeqQuery;
	queryString += statusQuery;
	queryString += typeQuery;
	queryString += sizeTotalMinQuery;
	queryString += sizeTotalMaxQuery;
	queryString += tlsTotalQuery;
	queryString += hasDuplicatedTitleQuery;
	queryString += hasDuplicatedDescriptionQuery;
	queryString += pageQuery;
	queryString += searchQuery;
	queryString += orderingQuery;

	scanApiEndpoint += queryString;

	return { scanApiEndpoint, queryString };
};
