import { SubscriptionsApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @returns {object} data, error, isValidating
 */
export const useSubscriptions = () => {
	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useSWR(SubscriptionsApiEndpoint);

	return { subscriptions, errorSubscriptions, validatingSubscriptions };
};
