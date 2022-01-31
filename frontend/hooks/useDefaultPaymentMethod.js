import { DefaultPaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @param {object} options
 * @returns {object} defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultPaymentMethod = (options = null) => {
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useMainSWRConfig(DefaultPaymentMethodApiEndpoint, options);

	return { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod };
};
