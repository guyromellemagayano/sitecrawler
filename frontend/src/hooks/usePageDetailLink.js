import { SitesApiEndpoint } from "@configs/ApiEndpoints";
import { ScanSlug, SiteLinkSlug, SitePageSlug } from "@configs/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {string} addQuery
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} pageId
 * @returns {object} pageDetailLink, errorPageDetailLink, validatingPageDetailLink
 */
export const usePageDetailLink = (addQuery = null, querySid = null, scanObjId = null, pageId = null) => {
	const currentQuery =
		typeof addQuery !== "undefined" && addQuery !== null && typeof addQuery === "string" && addQuery !== ""
			? "?" + addQuery
			: "";
	const currentEndpoint =
		typeof querySid !== "undefined" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		typeof scanObjId !== "undefined" &&
		scanObjId !== null &&
		scanObjId === "number" &&
		scanObjId > 0 &&
		typeof pageId !== "undefined" &&
		pageId !== null &&
		typeof pageId === "number" &&
		pageId !== 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SitePageSlug + pageId + SiteLinkSlug + currentQuery
			: null;

	const {
		data: pageDetailLink,
		error: errorPageDetailLink,
		isValidating: validatingPageDetailLink
	} = useMainSWRConfig(currentEndpoint);

	return { pageDetailLink, errorPageDetailLink, validatingPageDetailLink };
};
