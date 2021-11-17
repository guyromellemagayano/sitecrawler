import { PaymentMethodApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @returns {object} data, error, isValidating
 */
export const usePaymentMethods = () => {
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useSWR(PaymentMethodApiEndpoint);

	return { paymentMethods, errorPaymentMethods, validatingPaymentMethods };
};
