import { SubscriptionsApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @param {object} options
 * @returns {object} subscriptions, errorSubscriptions, validatingSubscriptions
 */
export const useSubscriptions = (options = null) => {
	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useMainSWRConfig(SubscriptionsApiEndpoint, options);

	return { subscriptions, errorSubscriptions, validatingSubscriptions };
};
