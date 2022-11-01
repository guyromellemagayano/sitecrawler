import { SitesApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { OnErrorRetryCount, RevalidationInterval } from "@constants/GlobalValues";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { handleGetMethod } from "@helpers/handleHttpMethods";
import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

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

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Default options
	const defaultOptions = {
		errorRetryCount: OnErrorRetryCount,
		onSuccess: (data, key) => {
			if (data) {
				// If the user is not authenticated, redirect to the login page, otherwise redirect to the dashboard
				if (key === UserApiEndpoint) {
					const { status: userStatus, data: userData } = data;

					if (userStatus === 403 && userData.detail?.length > 0) {
						if (router.asPath.includes(DashboardSlug)) {
							router.replace(LoginLink);
						}
					} else {
						if (Math.round(userStatus / 100) === 2 && !userData.detail) {
							if (router.asPath === LoginLink || !router.asPath.includes(DashboardSlug)) {
								router.replace(DashboardSitesLink);
							}
						}
					}
				} else if (key === SitesApiEndpoint) {
					const { status: sitesStatus, data: sitesData } = data;

					if (sitesStatus === 204 && sitesData.detail?.length > 0) {
						mutate(key, { optimisticData: sitesData, rollbackOnError: true, revalidate: true });
					}
				} else return;
			}
		},
		onError: (err, key) => {
			if (err) {
				const { status } = err;

				if (status !== 403) {
					// Capture other errors and send to Sentry
					Sentry.captureException(err);

					return;
				}

				return Promise.reject(err);
			}
		},
		onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
			if (err) {
				const { status } = err;

				// Never retry on 404/403.
				if (status === 404 || status === 403) return;
			}

			// Never retry for a specific key.
			if (key === UserApiEndpoint) return;

			// Only retry up to 5 times.
			if (retryCount >= OnErrorRetryCount) return;

			// Retry after 1.5 seconds.
			setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
		}
	};

	// Custom options
	let customOptions = { ...defaultOptions, ...options };

	// SWR hook for global mutations
	const { data, error, isValidating } = useSWR(endpoint, handleGetMethod, {
		...customOptions
	});

	return { data, error, isValidating };
};
