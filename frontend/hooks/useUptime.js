import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { UptimeSlug } from "@constants/PageLinks";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `uptime` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} uptime, errorUptime, validatingUptime
 */
export const useUptime = (querySid = null, options = null) => {
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0 ? SitesApiEndpoint + querySid + UptimeSlug : null;

	const {
		data: uptime,
		error: errorUptime,
		isValidating: validatingUptime
	} = useMainSWRConfig(currentEndpoint, options);

	return { uptime, errorUptime, validatingUptime };
};
