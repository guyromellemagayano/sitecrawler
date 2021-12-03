import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { OnErrorRetryCount, RevalidationInterval } from "@constants/GlobalValues";
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
	// Router
	const { asPath } = useRouter();

	const { data, error, isValidating } = useSWR(endpoint, useGetMethod, {
		// Capture unknown errors and send to Sentry
		onError: (err, key, config) => {
			Sentry.withScope((scope) => {
				scope.setExtra("action", "onError");
				scope.setExtra("route", asPath);
				scope.setExtra("key", key);
				scope.setExtra("config", config);
				Sentry.captureException(err);
			});

			return err;
		},
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			// Capture unknown errors and send to Sentry
			Sentry.withScope((scope) => {
				scope.setExtra("action", "onErrorRetry");
				scope.setExtra("route", asPath);
				scope.setExtra("key", key);
				scope.setExtra("config", config);
				Sentry.captureException(err);
			});

			// Never retry on 404.
			if (err.status === 404) return;

			// Never retry for a specific key.
			if (key === UserApiEndpoint) return;

			// Only retry up to 5 times.
			if (retryCount >= OnErrorRetryCount) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
		}
	});

	return { data, error, isValidating };
};
