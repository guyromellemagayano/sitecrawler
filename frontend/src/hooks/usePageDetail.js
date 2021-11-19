import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `page detail` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @param {number} linkId
 * @returns {object} data, error, isValidating
 */
export const usePageDetail = (querySid = 0, scanObjId = 0, linkId = 0) => {
	const scanSlug = "/scan/";
	const pageSlug = "/page/";

	const {
		data: pageDetail,
		error: errorPageDetail,
		isValidating: validatingPageDetail
	} = useSWR(
		typeof querySid !== "undefined" &&
			querySid !== null &&
			querySid !== 0 &&
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId !== 0 &&
			typeof linkId !== "undefined" &&
			linkId !== null &&
			linkId !== 0
			? SiteApiEndpoint + querySid + scanSlug + scanObjId + pageSlug + linkId + "/"
			: null
	);

	return { pageDetail, errorPageDetail, validatingPageDetail };
};
