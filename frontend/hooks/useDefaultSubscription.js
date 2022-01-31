import { DefaultSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the default payment method
 *
 * @param {object} options
 * @returns {object} defaultSubscription, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultSubscription = (options = null) => {
	const {
		data: defaultSubscription,
		error: errorDefaultSubscription,
		isValidating: validatingDefaultSubscription
	} = useMainSWRConfig(DefaultSubscriptionApiEndpoint, options);

	return { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription };
};
