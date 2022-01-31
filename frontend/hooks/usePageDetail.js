import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug, SitePageSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `page detail` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} linkId
 * @param {object} options
 * @returns {object} pageDetail, errorPageDetail, validatingPageDetail
 */
export const usePageDetail = (querySid = null, scanObjId = null, linkId = null, options = null) => {
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0 &&
		linkId !== null &&
		linkId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + SitePageSlug + linkId + "/"
			: null;

	const {
		data: pageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useMainSWRConfig(currentEndpoint, options);

	return { pageDetail, errorPageDetail, validatingPageDetail };
};
