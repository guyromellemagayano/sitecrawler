import { DefaultSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the default payment method
 *
 * @param {object} options
 * @returns {object} defaultSubscription, errorDefaultPaymentMethod, validatingDefaultPaymentMethod
 */
export const useDefaultSubscription = (options = null) => {
	// Custom context
	const { setConfig: setDefaultSubscriptionConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = DefaultSubscriptionApiEndpoint;

	const {
		data: defaultSubscription,
		error: errorDefaultSubscription,
		isValidating: validatingDefaultSubscription
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorDefaultSubscription) {
			// Show alert message after failed `user` SWR hook fetch
			errorDefaultSubscription
				? setDefaultSubscriptionConfig({
						isSites: true,
						method: errorDefaultSubscription?.config?.method ?? null,
						status: errorDefaultSubscription?.status ?? null
				  })
				: null;
		}
	}, [errorDefaultSubscription]);

	// TODO: Figure out what object this endpoint outputs

	return { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription };
};
