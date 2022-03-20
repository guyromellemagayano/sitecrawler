import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod, mutateDefaultPaymentMethod
 */
export const useDefaultPaymentMethod = (endpoint = null, options = null) => {
	// SWR hook
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useMainSWRConfig(endpoint, options);

	return {
		defaultPaymentMethod,
		errorDefaultPaymentMethod,
		validatingDefaultPaymentMethod
	};
};
