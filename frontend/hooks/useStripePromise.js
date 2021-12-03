import { StripePromiseApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @returns {object} stripePromise, errorStripePromise, validatingStripePromise
 */
export const useStripePromise = () => {
	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useMainSWRConfig(StripePromiseApiEndpoint);

	return { stripePromise, errorStripePromise, validatingStripePromise };
};
