import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current payment method
 *
 * @param {object} options
 * @returns {object} currentSubscription, errorCurrentSubscription, validatingCurrentSubscription
 */
export const useCurrentSubscription = (endpoint = null, options = null) => {
	// SWR hook
	const {
		data: currentSubscription,
		error: errorCurrentSubscription,
		isValidating: validatingCurrentSubscription
	} = useMainSWRConfig(endpoint, options);

	return {
		currentSubscription,
		errorCurrentSubscription,
		validatingCurrentSubscription
	};
};
