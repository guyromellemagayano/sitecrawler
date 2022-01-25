import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ScanSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's crawl `stats` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} stats, errorStats, validatingStats
 */
export const useStats = (querySid = null, scanObjId = null) => {
	const currentEndpoint =
		querySid !== null &&
		typeof querySid === "number" &&
		querySid > 0 &&
		scanObjId !== null &&
		typeof scanObjId === "number" &&
		scanObjId > 0
			? SitesApiEndpoint + querySid + ScanSlug + scanObjId + "/"
			: null;

	const { data: stats, error: errorStats, isValidating: validatingStats } = useMainSWRConfig(currentEndpoint);

	return { stats, errorStats, validatingStats };
};
