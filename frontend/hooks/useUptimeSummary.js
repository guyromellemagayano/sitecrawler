import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { SummarySlug, UptimeSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `uptime summary` information
 *
 * @param {number} querySid
 * @returns {object} uptimeSummary, errorUptimeSummary, validatingUptimeSummary
 */
export const useUptimeSummary = (querySid = null) => {
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0
			? SitesApiEndpoint + querySid + UptimeSlug + SummarySlug
			: null;

	const {
		data: uptimeSummary,
		error: errorUptimeSummary,
		isValidating: validatingUptimeSummary
	} = useMainSWRConfig(currentEndpoint);

	return { uptimeSummary, errorUptimeSummary, validatingUptimeSummary };
};
