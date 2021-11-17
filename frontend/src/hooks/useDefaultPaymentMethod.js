import { DefaultPaymentMethodApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @returns {object} data, error, isValidating
 */
export const useDefaultPaymentMethod = () => {
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useSWR(DefaultPaymentMethodApiEndpoint);

	return { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod };
};
