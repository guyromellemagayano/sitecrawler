import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SiteLinkSlug, SitePageSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {string} addQuery
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} pageId
 * @param {object} options
 * @returns {object} pageDetailLink, errorPageDetailLink, validatingPageDetailLink
 */
export const usePageDetailLink = (
	addQuery = null,
	querySid = null,
	scanObjId = null,
	pageId = null,
	options = null
) => {
	const currentQuery = addQuery !== null && typeof addQuery === "string" && addQuery !== "" ? "?" + addQuery : "";
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		scanObjId === "number" &&
		scanObjId > 0 &&
		pageId !== null &&
		typeof pageId === "number" &&
		pageId !== 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SitePageSlug + pageId + SiteLinkSlug + currentQuery
			: null;

	const {
		data: pageDetailLink,
		error: errorPageDetailLink,
		isValidating: validatingPageDetailLink
	} = useMainSWRConfig(currentEndpoint, options);

	return { pageDetailLink, errorPageDetailLink, validatingPageDetailLink };
};
