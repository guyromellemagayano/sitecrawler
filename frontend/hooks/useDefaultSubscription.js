import { DefaultSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the default payment method
 *
 * @returns {object} defaultSubscription, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultSubscription = () => {
	const {
		data: defaultSubscription,
		error: errorDefaultSubscription,
		isValidating: validatingDefaultSubscription
	} = useMainSWRConfig(DefaultSubscriptionApiEndpoint);

	return { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription };
};
