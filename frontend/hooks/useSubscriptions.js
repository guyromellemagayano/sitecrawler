import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @param {stripe} endpoint
 * @param {object} options
 * @returns {object} subscriptions, errorSubscriptions, validatingSubscriptions
 */
export const useSubscriptions = (endpoint = null, options = null) => {
	// SWR hook
	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useMainSWRConfig(endpoint, options);

	return {
		subscriptions,
		errorSubscriptions,
		validatingSubscriptions
	};
};
