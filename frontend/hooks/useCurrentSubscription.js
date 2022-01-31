import { CurrentSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current payment method
 *
 * @param {object} options
 * @returns {object} currentSubscription, errorCurrentSubscription, validatingCurrentSubscription
 */
export const useCurrentSubscription = (options = null) => {
	const {
		data: currentSubscription,
		error: errorCurrentSubscription,
		isValidating: validatingCurrentSubscription
	} = useMainSWRConfig(CurrentSubscriptionApiEndpoint, options);

	return { currentSubscription, errorCurrentSubscription, validatingCurrentSubscription };
};
