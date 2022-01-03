import { CurrentSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current payment method
 *
 * @returns {object} currentSubscription, errorCurrentSubscription, validatingCurrentSubscription
 */
export const useCurrentSubscription = () => {
	const {
		data: currentSubscription,
		error: errorCurrentSubscription,
		isValidating: validatingCurrentSubscription
	} = useMainSWRConfig(CurrentSubscriptionApiEndpoint);

	return { currentSubscription, errorCurrentSubscription, validatingCurrentSubscription };
};
