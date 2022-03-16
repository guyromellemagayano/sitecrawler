import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @param {string} endpoint
 * @param {function} setConfig
 * @param {object} options
 * @returns {object} stripePromise, errorStripePromise, validatingStripePromise
 */
export const useStripePromise = (endpoint = null, setConfig, options = null) => {
	// SWR hooks
	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useMainSWRConfig(endpoint, setConfig, options);

	return { stripePromise, errorStripePromise, validatingStripePromise };
};
