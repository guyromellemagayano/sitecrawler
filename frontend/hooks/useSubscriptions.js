import { SubscriptionsApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle `stripe` subscriptions
 *
 * @param {object} options
 * @returns {object} subscriptions, errorSubscriptions, validatingSubscriptions, subscriptionsResults, subscriptionsCount
 */
export const useSubscriptions = (options = null) => {
	const [subscriptionsCount, setSubscriptionsCount] = useState(0);
	const [subscriptionsResults, setSubscriptionsResults] = useState([]);
	const [planName, setPlanName] = useState("");
	const [planId, setPlanId] = useState("");

	// Custom context
	const { setConfig: setSubscriptionsConfig } = useContext(SiteCrawlerAppContext);

	// Custom variable
	const currentEndpoint = SubscriptionsApiEndpoint;

	const {
		data: subscriptions,
		error: errorSubscriptions,
		isValidating: validatingSubscriptions
	} = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
		if (errorSubscriptions) {
			// Show alert message after failed `user` SWR hook fetch
			errorSubscriptions
				? setSubscriptionsConfig({
						isSubscriptions: true,
						method: errorSubscriptions?.config?.method ?? null,
						status: errorSubscriptions?.status ?? null
				  })
				: null;
		}
	}, [errorSubscriptions]);

	useMemo(async () => {
		if (subscriptions?.data) {
			if (subscriptions.data?.count) {
				setSubscriptionsCount(subscriptions.data.count);
			}

			if (subscriptions.data?.results) {
				setSubscriptionsResults(subscriptions.data.results);
			}
		}

		return { subscriptionsResults, subscriptionsCount };
	}, [subscriptions, subscriptionsResults, subscriptionsCount]);

	return { subscriptions, errorSubscriptions, validatingSubscriptions, subscriptionsResults, subscriptionsCount };
};
