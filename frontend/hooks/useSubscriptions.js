import { SubscriptionsApiEndpoint } from "@configs/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @returns {object} subscriptions, errorSubscriptions, validatingSubscriptions
 */
export const useSubscriptions = () => {
	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useMainSWRConfig(SubscriptionsApiEndpoint);

	return { subscriptions, errorSubscriptions, validatingSubscriptions };
};
