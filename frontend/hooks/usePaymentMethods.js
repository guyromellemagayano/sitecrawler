import { PaymentMethodApiEndpoint } from "@configs/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @returns {object} paymentMethods, errorPaymentMethods, validatingPaymentMethods
 */
export const usePaymentMethods = () => {
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useMainSWRConfig(PaymentMethodApiEndpoint);

	return { paymentMethods, errorPaymentMethods, validatingPaymentMethods };
};
