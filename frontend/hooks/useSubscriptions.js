import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @param {stripe} endpoint
 * @param {object} options
 * @returns {object} subscriptions, errorSubscriptions, validatingSubscriptions
 */
export const useSubscriptions = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useMainSWRConfig(endpoint, setConfig, options);

	return {
		subscriptions,
		errorSubscriptions,
		validatingSubscriptions
	};
};
