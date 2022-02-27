import { CurrentSubscriptionApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the current payment method
 *
 * @param {object} options
 * @returns {object} currentSubscription, errorCurrentSubscription, validatingCurrentSubscription, currentSubscriptionId
 */
export const useCurrentSubscription = (options = null) => {
	const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
	const [cancelAtCurrentSubscription, setCancelAtCurrentSubscription] = useState(null);

	// Custom context
	const { setConfig: setCurrentSubscriptionConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = CurrentSubscriptionApiEndpoint;

	// SWR hook
	const {
		data: currentSubscription,
		error: errorCurrentSubscription,
		isValidating: validatingCurrentSubscription
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorCurrentSubscription) {
			// Show alert message after failed `user` SWR hook fetch
			errorCurrentSubscription
				? setCurrentSubscriptionConfig({
						isCurrentSubscription: true,
						method: errorCurrentSubscription?.config?.method ?? null,
						status: errorCurrentSubscription?.status ?? null
				  })
				: null;
		}
	}, [errorCurrentSubscription]);

	useMemo(async () => {
		if (currentSubscription?.data) {
			if (currentSubscription.data?.id !== null) {
				setCurrentSubscriptionId(currentSubscription.id);
			} else {
				setCurrentSubscriptionId(null);
			}

			if (currentSubscription.data?.cancel_at !== null) {
				setCancelAtCurrentSubscription(currentSubscription.data.cancel_at);
			} else {
				setCancelAtCurrentSubscription(null);
			}
		}

		return { currentSubscriptionId, cancelAtCurrentSubscription };
	}, [currentSubscription, currentSubscriptionId, cancelAtCurrentSubscription]);

	return {
		currentSubscription,
		errorCurrentSubscription,
		validatingCurrentSubscription,
		currentSubscriptionId
	};
};
