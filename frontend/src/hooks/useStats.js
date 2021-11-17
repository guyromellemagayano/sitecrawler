import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a site's crawl `stats` information
 *
 * @param {number} querySid
 * @param {number} scanObjId
 * @returns {object} data, error, isValidating
 */
export const useStats = (querySid = 0, scanObjId = 0) => {
	const scanEndpoint = "/scan/";

	const {
		data: stats,
		error: errorStats,
		isValidating: validatingStats
	} = useSWR(
		typeof querySid !== "undefined" &&
			querySid !== null &&
			querySid !== 0 &&
			typeof scanObjId !== "undefined" &&
			scanObjId !== null &&
			scanObjId !== 0
			? SiteApiEndpoint + querySid + scanEndpoint + scanObjId + "/"
			: null
	);

	return { stats, errorStats, validatingStats };
};
