import { DefaultPaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @returns {object} defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultPaymentMethod = () => {
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useMainSWRConfig(DefaultPaymentMethodApiEndpoint);

	return { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod };
};
