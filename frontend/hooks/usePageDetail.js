import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SitePageSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page detail` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} linkId
 * @returns {object} pageDetail, errorPageDetail, validatingPageDetail
 */
export const usePageDetail = (querySid = null, scanObjId = null, linkId = null) => {
	const currentEndpoint =
		typeof querySid !== "undefined" &&
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		typeof scanObjId !== "undefined" &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		typeof linkId !== "undefined" &&
		linkId !== null &&
		linkId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SitePageSlug + linkId + "/"
			: null;

	const {
		data: pageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useMainSWRConfig(currentEndpoint);

	return { pageDetail, errorPageDetail, validatingPageDetail };
};
