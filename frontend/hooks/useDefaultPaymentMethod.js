import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current default payment method
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod, mutateDefaultPaymentMethod
 */
export const useDefaultPaymentMethod = (endpoint = null, setConfig, options = null) => {
	// SWR hook
	const {
		data: defaultPaymentMethod,
		error: errorDefaultPaymentMethod,
		isValidating: validatingDefaultPaymentMethod
	} = useMainSWRConfig(endpoint, setConfig, options);

	return {
		defaultPaymentMethod,
		errorDefaultPaymentMethod,
		validatingDefaultPaymentMethod
	};
};
