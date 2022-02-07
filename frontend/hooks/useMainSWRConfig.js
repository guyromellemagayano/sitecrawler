import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { OnErrorRetryCount, RevalidationInterval } from "@constants/GlobalValues";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { handleGetMethod } from "@helpers/handleHttpMethods";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useNotificationMessage } from "./useNotificationMessage";
const { createContext, useContext } = require("react");

/**
 * Main SWR React hook that will handle all the data fetching, error reporting, and revalidating when `onErrorRetry` is triggered within the app
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} data, error, isValidating
 */
export const useMainSWRConfig = (endpoint = null, options = null) => {
	// Router
	const router = useRouter();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// Default options
	const defaultOptions = {
		errorRetryCount: OnErrorRetryCount,
		onSuccess: (data, key) => {
			// If the user is not authenticated, redirect to the login page, otherwise redirect to the dashboard
			if (key === UserApiEndpoint) {
				if (data.status === 403 && data.data.detail?.length > 0) {
					if (router.asPath.includes(DashboardSlug)) {
						router.replace(LoginLink);
					}
				} else {
					if (Math.round(data.status / 100) === 2 && !data.data.detail) {
						if (router.asPath.includes(LoginLink)) {
							router.replace(DashboardSitesLink);
						}
					}
				}
			}
		},
		onError: (err, key) => {
			// Capture unknown errors and send to Sentry
			Sentry.captureException(err);

			return err;
		},
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (err.status === 404) return;

			// Never retry for a specific key.
			if (key === UserApiEndpoint) return;

			// Only retry up to 5 times.
			if (retryCount >= OnErrorRetryCount) return;

			// Capture unknown errors and send to Sentry
			Sentry.captureException(err);

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
