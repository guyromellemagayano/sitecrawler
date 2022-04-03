import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `uptime summary` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} uptimeSummary, errorUptimeSummary, validatingUptimeSummary
 */
export const useUptimeSummary = (endpoint = null, options = null) => {
	// SWR hook
	const {
		data: uptimeSummary,
		error: errorUptimeSummary,
		isValidating: validatingUptimeSummary
	} = useMainSWRConfig(endpoint, options);

	return { uptimeSummary, errorUptimeSummary, validatingUptimeSummary };
};
