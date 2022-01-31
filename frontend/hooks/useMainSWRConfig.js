import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { OnErrorRetryCount, RevalidationInterval } from "@constants/GlobalValues";
import { handleGetMethod } from "@helpers/handleHttpMethods";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import useSWR from "swr";

/**
 * Main SWR React hook that will handle all the data fetching, error reporting, and revalidating when `onErrorRetry` is triggered within the app
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} data, error, isValidating
 */
export const useMainSWRConfig = (endpoint = null, options = null) => {
	// Router
	const { asPath } = useRouter();

	// Default options
	const defaultOptions = {
		errorRetryCount: OnErrorRetryCount,
		onError: (err, key, config) => {
			// Capture unknown errors and send to Sentry
			Sentry.captureException(err);

			return err;
		},
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			// Capture unknown errors and send to Sentry
			Sentry.captureException(err);

			// Never retry on 404.
			if (err.status === 404) return;

			// Never retry for a specific key.
			if (key === UserApiEndpoint) return;

			// Only retry up to 5 times.
			if (retryCount >= OnErrorRetryCount) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
		}
	};

	// Custom options
	let customOptions = { ...defaultOptions };

	if (options !== null && typeof options === "object" && Object.keys(options)?.length > 0) {
		customOptions = { ...defaultOptions, ...options };
	}

	// SWR hook for global mutations
	const { data, error, isValidating } = useSWR(endpoint, handleGetMethod, {
		...customOptions
	});

	return { data, error, isValidating };
};
