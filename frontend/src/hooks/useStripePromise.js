import { StripePromiseApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @returns {object} data, error, isValidating
 */
export const useStripePromise = () => {
	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useSWR(StripePromiseApiEndpoint);

	return { stripePromise, errorStripePromise, validatingStripePromise };
};
