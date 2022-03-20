import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} paymentMethods, errorPaymentMethods, validatingPaymentMethods
 */
export const usePaymentMethods = (endpoint = null, options = null) => {
	// SWR hook
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useMainSWRConfig(endpoint, options);

	return {
		paymentMethods,
		errorPaymentMethods,
		validatingPaymentMethods
	};
};
