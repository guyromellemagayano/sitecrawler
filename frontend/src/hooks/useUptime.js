import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle a site's `uptime` information
 *
 * @param {number} querySid
 * @returns {object} data, error, isValidating
 */
export const useUptime = (querySid = 0) => {
	const uptimeEndpoint = "/uptime/";

	const {
		data: uptime,
		error: errorUptime,
		isValidating: validatingUptime
	} = useSWR(
		typeof querySid !== "undefined" && querySid !== null && querySid !== 0
			? SiteApiEndpoint + querySid + uptimeEndpoint
			: null
	);

	return { uptime, errorUptime, validatingUptime };
};
