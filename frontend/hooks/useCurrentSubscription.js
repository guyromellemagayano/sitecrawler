import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current payment method
 *
 * @param {object} options
 * @returns {object} currentSubscription, errorCurrentSubscription, validatingCurrentSubscription
 */
export const useCurrentSubscription = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: currentSubscription,
		error: errorCurrentSubscription,
		isValidating: validatingCurrentSubscription
	} = useMainSWRConfig(endpoint, setConfig, options);

	return {
		currentSubscription,
		errorCurrentSubscription,
		validatingCurrentSubscription
	};
};
