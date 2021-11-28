import { OnErrorRetryCount, RevalidationInterval } from "@configs/GlobalValues";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useGetMethod } from "./useHttpMethod";

/**
 * Main SWR React hook that will handle all the data fetching, error reporting, and revalidating when `onErrorRetry` is triggered within the app
 *
 * @param {string} endpoint
 * @returns {object} data, error, isValidating
 */
export const useMainSWRConfig = (endpoint = null) => {
	const { data, error, isValidating } = useSWR(endpoint, useGetMethod, {
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			// Router
			const { asPath } = useRouter();

			// Capture unknown errors and send to Sentry
			Sentry.configureScope((scope) => {
				scope.setTag("action", "onErrorRetry");
				scope.setTag("route", asPath);
				scope.setTag("key", key);
				scope.setTag("config", config);
				Sentry.captureException(new Error(err));
			});

			// Only retry up to 5 times.
			if (retryCount >= OnErrorRetryCount) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
		}
	});

	return { data, error, isValidating };
};
