import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle all the payment methods
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} paymentMethods, errorPaymentMethods, validatingPaymentMethods, paymentMethodResults, setPaymentMethodsConfig
 */
export const usePaymentMethods = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: paymentMethods,
		error: errorPaymentMethods,
		isValidating: validatingPaymentMethods
	} = useMainSWRConfig(endpoint, setConfig, options);

	return {
		paymentMethods,
		errorPaymentMethods,
		validatingPaymentMethods
	};
};
