import { PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {object} options
 * @returns {object} paymentMethods, errorPaymentMethods, validatingPaymentMethods
 */
export const usePaymentMethods = (options = null) => {
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useMainSWRConfig(PaymentMethodApiEndpoint, options);

	return { paymentMethods, errorPaymentMethods, validatingPaymentMethods };
};
