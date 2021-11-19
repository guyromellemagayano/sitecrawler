import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `uptime summary` information
 *
 * @param {number} querySid
 * @returns {object} data, error, isValidating
 */
export const useUptimeSummary = (querySid = 0) => {
	const uptimeSummarySlug = "/uptime/summary/";

	const {
		data: uptimeSummary,
		error: errorUptimeSummary,
		isValidating: validatingUptimeSummaryError
	} = useSWR(
		typeof querySid !== "undefined" && querySid !== null && querySid !== 0
			? SiteApiEndpoint + querySid + uptimeSummarySlug
			: null
	);

	return { uptimeSummary, errorUptimeSummary, validatingUptimeSummaryError };
};
