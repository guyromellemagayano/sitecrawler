import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { perPageQuery, sortByNameAscending } from "@constants/GlobalValues";
import {
	DashboardSitesLink,
	SiteImageSlug,
	SiteImagesSlug,
	SiteLinkSlug,
	SiteLinksSlug,
	SitePageSlug,
	SitePagesSlug
} from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useRouter } from "next/router";
import { useContext } from "react";
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

	// Custom context
	const { customScanApiEndpoint, user, querySiteId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	let scanApiEndpoint = "";
	let queryString = "";
	let filterQueryString = "";

	const largePageSizeThreshold = user?.data?.large_page_size_threshold ?? null;
	const permissions = user?.data?.permissions ?? null;

	// Site `scan` SWR hook
	const { scanObjId } = useScan(customScanApiEndpoint);

	scanObjId && asPath.includes(SiteLinksSlug)
		? (scanApiEndpoint +=
				customScanApiEndpoint +
				scanObjId +
				SiteLinkSlug +
				(scanApiEndpoint.includes("?") ? "&" : "?") +
				`${perPageQuery + linksPerPage}`)
		: scanObjId && asPath.includes(SitePagesSlug)
		? (scanApiEndpoint +=
				customScanApiEndpoint +
				scanObjId +
				SitePageSlug +
				(scanApiEndpoint.includes("?") ? "&" : "?") +
				`${perPageQuery + linksPerPage}`)
		: scanObjId && asPath.includes(SiteImagesSlug)
		? (scanApiEndpoint +=
				customScanApiEndpoint +
				scanObjId +
				SiteImageSlug +
				(scanApiEndpoint.includes("?") ? "&" : "?") +
				`${perPageQuery + linksPerPage}`)
		: querySiteId && asPath.includes(DashboardSitesLink)
		? (scanApiEndpoint += SitesApiEndpoint + querySiteId + "/")
		: typeof window !== "undefined" && asPath === DashboardSitesLink + window.location.search
		? (scanApiEndpoint +=
				SitesApiEndpoint + (scanApiEndpoint.includes("?") ? "&" : "?") + `${perPageQuery + linksPerPage}`)
		: null;

	const typeString = query?.type ? (Array.isArray(query?.type) ? query.type.join("&type=") : query.type) : "";

	// Sites
	const verifiedQuery = query?.verified
		? scanApiEndpoint.includes("?")
			? `&verified=${query.verified}`
			: `?verified=${query.verified}`
		: "";

	// Links
	const statusQuery = query?.status
		? scanApiEndpoint.includes("?")
			? `&status=${query.status}`
			: `?status=${query.status}`
		: "";

	const statusNeqQuery = query?.status__neq
		? scanApiEndpoint.includes("?")
			? `&status__neq=${query.status__neq}`
			: `?status__neq=${query.status__neq}`
		: "";

	const typeQuery = typeString ? (scanApiEndpoint.includes("?") ? `&type=${typeString}` : `?type=${typeString}`) : "";
	const typeNeqQuery = typeString
		? scanApiEndpoint.includes("?")
			? `&type__neq=${typeString}`
			: `?type__neq=${typeString}`
		: "";

	// Pages
	const hasTitleQuery = query?.has_title
		? scanApiEndpoint.includes("?")
			? `&has_title=${query.has_title}`
			: `?has_title=${query.has_title}`
		: "";

	const hasDescriptionQuery = query?.has_description
		? scanApiEndpoint.includes("?")
			? `&has_description=${query.has_description}`
			: `?has_description=${query.has_description}`
		: "";

	const hasH1FirstQuery = query?.has_h1_first
		? scanApiEndpoint.includes("?")
			? `&has_h1_first=${query.has_h1_first}`
			: `?has_h1_first=${query.has_h1_first}`
		: "";

	const hasH1SecondQuery = query?.has_h1_second
		? scanApiEndpoint.includes("?")
			? `&has_h1_second=${query.has_h1_second}`
			: `?has_h1_second=${query.has_h1_second}`
		: "";

	const hasH2FirstQuery = query?.has_h2_first
		? scanApiEndpoint.includes("?")
			? `&has_h2_first=${query.has_h2_first}`
			: `?has_h2_first=${query.has_h2_first}`
		: "";

	const hasH2SecondQuery = query?.has_h2_second
		? scanApiEndpoint.includes("?")
			? `&has_h2_second=${query.has_h2_second}`
			: `?has_h2_second=${query.has_h2_second}`
		: "";

	const hasDuplicatedTitle = query?.has_duplicated_title
		? scanApiEndpoint.includes("?")
			? `&has_duplicated_title=${query.has_duplicated_title}`
			: `?has_duplicated_title=${query.has_duplicated_title}`
		: "";

	const hasDuplicatedDescription = query?.has_duplicated_description
		? scanApiEndpoint.includes("?")
			? `&has_duplicated_description=${query.has_duplicated_description}`
			: `?has_duplicated_description=${query.has_duplicated_description}`
		: "";

	const tlsImagesQuery = query?.tls_images
		? scanApiEndpoint.includes("?")
			? `&status=${query.tls_images}`
			: `?status=${query.tls_images}`
		: "";

	const tlsScriptsQuery = query?.tls_scripts
		? scanApiEndpoint.includes("?")
			? `&status=${query.tls_scripts}`
			: `?status=${query.tls_scripts}`
		: "";

	const tlsStylesheetsQuery = query?.tls_stylesheets
		? scanApiEndpoint.includes("?")
			? `&status=${query.tls_stylesheets}`
			: `?status=${query.tls_stylesheets}`
		: "";

	const sizeTotalMaxQuery = query?.size_total_max
		? scanApiEndpoint.includes("?")
			? `&size_total_max=${query.size_total_max}`
			: `?size_total_max=${query.size_total_max}`
		: "";

	const sizeTotalMinQuery = query?.size_total_min
		? scanApiEndpoint.includes("?")
			? `&size_total_min=${query.size_total_min}`
			: `?size_total_min=${query.size_total_min}`
		: "";

	// Images
	const tlsStatusQuery = query?.tls_status
		? scanApiEndpoint.includes("?")
			? `&tls_status=${query.tls_status}`
			: `?tls_status=${query.tls_status}`
		: "";

	const tlsStatusNeqQuery = query?.tls_status__neq
		? scanApiEndpoint.includes("?")
			? `&tls_status__neq=${query.tls_status__neq}`
			: `?tls_status__neq=${query.tls_status__neq}`
		: "";

	const missingAltsIsZeroQuery = query?.missing_alts__iszero
		? scanApiEndpoint.includes("?")
			? `&missing_alts__iszero=${query.missing_alts__iszero}`
			: `?missing_alts__iszero=${query.missing_alts__iszero}`
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
		: !asPath.includes(DashboardSitesLink + querySiteId + "/")
		? scanApiEndpoint.includes("?")
			? `&ordering=${sortByNameAscending}`
			: `?ordering=${sortByNameAscending}`
		: "";

	queryString += orderingQuery;
	queryString += verifiedQuery;
	queryString += statusQuery;
	queryString += statusNeqQuery;
	queryString += typeQuery;
	queryString += typeNeqQuery;
	queryString += hasTitleQuery;
	queryString += hasDescriptionQuery;
	queryString += hasH1FirstQuery;
	queryString += hasH1SecondQuery;
	queryString += hasH2FirstQuery;
	queryString += hasH2SecondQuery;
	queryString += hasDuplicatedTitle;
	queryString += hasDuplicatedDescription;
	queryString += tlsImagesQuery;
	queryString += tlsScriptsQuery;
	queryString += tlsStylesheetsQuery;
	queryString += sizeTotalMaxQuery;
	queryString += sizeTotalMinQuery;
	queryString += tlsStatusQuery;
	queryString += tlsStatusNeqQuery;
	queryString += missingAltsIsZeroQuery;
	queryString += pageQuery;
	queryString += searchQuery;

	scanApiEndpoint += queryString;

	if (typeof window !== "undefined") {
		filterQueryString = new URLSearchParams(window.location.search);
	}

	// console.log(scanApiEndpoint);

	return { scanApiEndpoint, queryString, filterQueryString };
};
