import { StripePromiseApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @param {object} options
 * @returns {object} stripePromise, errorStripePromise, validatingStripePromise
 */
export const useStripePromise = (options = null) => {
	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useMainSWRConfig(StripePromiseApiEndpoint, options);

	return { stripePromise, errorStripePromise, validatingStripePromise };
};
