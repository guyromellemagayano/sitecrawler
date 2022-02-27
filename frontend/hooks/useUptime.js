import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { UptimeSlug } from "@constants/PageLinks";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `uptime` information
 *
 * @param {number} querySid
 * @param {object} options
 * @returns {object} uptime, errorUptime, validatingUptime
 */
export const useUptime = (querySid = null, options = null) => {
	// Custom context
	const { setConfig: setUptimeConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint =
		querySid !== null && typeof querySid === "number" && querySid > 0 ? SitesApiEndpoint + querySid + UptimeSlug : null;

	// SWR hook
	const {
		data: uptime,
		error: errorUptime,
		isValidating: validatingUptime
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorUptime) {
			// Show alert message after failed `uptime` SWR hook fetch
			errorUptime
				? setUptimeConfig({
						isUptime: true,
						method: errorUptime?.config?.method ?? null,
						status: errorUptime?.status ?? null
				  })
				: null;
		}
	}, [errorUptime]);

	return { uptime, errorUptime, validatingUptime };
};
