import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} stripePromise, errorStripePromise, validatingStripePromise
 */
export const useStripePromise = (endpoint = null, options = null) => {
	// SWR hooks
	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useMainSWRConfig(endpoint, options);

	return { stripePromise, errorStripePromise, validatingStripePromise };
};
