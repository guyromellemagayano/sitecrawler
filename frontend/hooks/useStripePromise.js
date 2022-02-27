import { StripePromiseApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` promises
 *
 * @param {object} options
 * @returns {object} stripePromise, errorStripePromise, validatingStripePromise, stripePromiseData
 */
export const useStripePromise = (options = null) => {
	const [stripePromiseData, setStripePromiseData] = useState(null);

	// Custom context
	const { setConfig: setStripePromiseConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = StripePromiseApiEndpoint;

	const {
		data: stripePromise,
		error: errorStripePromise,
		isValidating: validatingStripePromise
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorStripePromise) {
			// Show alert message after failed `stripePromise` SWR hook fetch
			errorStripePromise
				? setStripePromiseConfig({
						isStripePromise: true,
						method: errorStripePromise?.config?.method ?? null,
						status: errorStripePromise?.status ?? null
				  })
				: null;
		}
	}, [errorStripePromise]);

	useMemo(async () => {
		if (stripePromise?.data) {
			if (stripePromise.data?.publishable_key) {
				const stripePromisePublishableKey =
					stripePromise?.data?.length > 0 ? await stripePromise.data.publishable_key : null;

				if (stripePromisePublishableKey) {
					setStripePromiseData(loadStripe(stripePromisePublishableKey, { stripePromise }));
				} else {
					setStripePromiseData(null);
				}
			}
		}

		return { stripePromiseData };
	}, [stripePromise, stripePromiseData]);

	return { stripePromise, errorStripePromise, validatingStripePromise, stripePromiseData };
};
