import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle a site's `uptime` information
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} uptime, errorUptime, validatingUptime
 */
export const useUptime = (endpoint = null, options = null) => {
	// SWR hook
	const { data: uptime, error: errorUptime, isValidating: validatingUptime } = useMainSWRConfig(endpoint, options);

	return { uptime, errorUptime, validatingUptime };
};
