import { SiteApiEndpoint } from "@configs/ApiEndpoints";
import { DashboardRoute, RedirectInterval, RevalidationInterval } from "@configs/GlobalValues";
import { SitesLink } from "@configs/PageLinks";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";
import useFetcher from "./useFetcher";

export const useSiteId = ({ status = null, querySid = 0, redirectIfFound = false }) => {
	const [siteIdData, setSiteIdData] = React.useState(null);
	const [isSiteIdReady, setIsSiteIdReady] = React.useState(false);
	const [siteIdErrorMessage, setSiteIdErrorMessage] = React.useState([]);
	const [siteIdSuccessMessage, setSiteIdSuccessMessage] = React.useState([]);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// Translations
	const { t } = useTranslation("common");
	const siteIdOkSuccess = t("siteIdOkSuccess");
	const siteIdCreatedSuccess = t("siteIdCreatedSucces");
	const siteIdBadRequestError = t("siteIdBadRequestError");
	const siteIdForbiddenError = t("siteIdForbiddenError");
	const siteIdNotFoundError = t("siteIdNotFoundError");
	const siteIdTooManyRequests = t("siteIdTooManyRequests");
	const siteIdInternalServerError = t("siteIdInternalServerError");
	const siteIdBadGatewayError = t("siteIdBadGatewayError");
	const siteIdServiceUnavailableError = t("siteIdServiceUnavailableError");
	const siteIdGatewayTimeoutError = t("siteIdGatewayTimeoutError");
	const siteIdUnknownError = t("siteIdUnknownError");

	// SWR hook for `siteId`
	const {
		data: siteId,
		mutate: mutateSiteId,
		error: errorSiteId,
		isValidating: validatingSiteId
	} = useSWR(querySid !== 0 ? SiteApiEndpoint + querySid + "/" : null, useFetcher);

	React.useEffect(() => {
		!validatingSiteId
			? (() => {
					typeof siteId !== "undefined" && siteId !== null
						? (() => {
								if (Math.round(status / 200) === 1) {
									typeof siteId?.data === "object" && Object.keys(siteId?.data).length > 0
										? (() => {
												(typeof siteId?.data?.verified !== "undefined" &&
													typeof siteId?.data?.last_finished_scan_id !== "undefined" &&
													!redirectIfFound) ||
												(typeof siteId?.data?.verified !== "undefined" &&
													typeof siteId?.data?.last_finished_scan_id !== "undefined" &&
													!redirectIfFound) ||
												(typeof siteId?.data?.verified !== "undefined" &&
													typeof siteId?.data?.last_finished_scan_id !== "undefined")
													? (() => {
															// Update `siteIdData` with an actual `siteId` data object
															setSiteIdData(siteId?.data);

															// Report success when `siteId` is found
															setSiteIdSuccessMessage((prevState) => [...prevState, siteIdOkSuccess]);

															// Update `isSiteIdReady` state to true
															setIsSiteIdReady(true);

															// After the `RevalidationInterval` timer elapsed, remove the current success message
															setTimeout(() => {
																setSiteIdSuccessMessage((prevState) => [
																	...prevState,
																	prevState.indexOf(siteIdOkSuccess) !== -1
																		? prevState.splice(prevState.indexOf(siteIdOkSuccess), 1)
																		: null
																]);
															}, RevalidationInterval);
													  })()
													: (() => {
															setTimeout(() => {
																router.push(SitesLink);
															}, RedirectInterval);
													  })();
										  })()
										: (() => {
												// Report error when `siteId` is not found
												setSiteIdErrorMessage((prevState) => [...prevState, siteIdNotFoundError]);

												// Update `isSiteIdReady` state to false
												setIsSiteIdReady(false);

												// Capture 2XX errors and send to Sentry
												Sentry.configureScope((scope) => {
													scope.setTag("route", asPath);
													scope.setTag("status", status);
													scope.setTag(
														"message",
														siteIdErrorMessage.find((message) => message === siteIdUnknownError)
													);
													Sentry.captureException(new Error(errorSiteId));
												});

												// After the `RevalidationInterval` timer elapsed, remove the current error message
												setTimeout(() => {
													setSiteIdSuccessMessage((prevState) => [
														...prevState,
														prevState.indexOf(siteIdUnknownError) !== -1
															? prevState.splice(prevState.indexOf(siteIdUnknownError), 1)
															: null
													]);
												}, RevalidationInterval);
										  })();
								} else if (Math.round(status / 400) === 1) {
									asPath.includes(DashboardRoute)
										? (() => {
												switch (status) {
													case 400:
														// Report 400 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdBadRequestError]);

														// Update `isSiteIdReady` state to false
														setIsSiteIdReady(false);

														// Capture 400 bad request errors and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdBadRequestError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdBadRequestError) !== -1
																	? prevState.splice(prevState.indexOf(siteIdBadRequestError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
													case 403:
														// Report 403 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdForbiddenError]);

														// Update `isSiteIdReady` state to false
														setIsSiteIdReady(false);

														// Capture 403 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdForbiddenError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdForbiddenError) !== -1
																	? prevState.splice(prevState.indexOf(siteIdForbiddenError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
													case 404:
														// Report 404 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdNotFoundError]);

														// Update `isSiteIdReady` state to false
														setIsSiteIdReady(false);

														// Capture 404 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdNotFoundError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdNotFoundError) !== -1
																	? prevState.splice(prevState.indexOf(siteIdNotFoundError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
													case 429:
														// Report 429 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdTooManyRequests]);

														// Update `isSiteIdReady` state to false
														setIsSiteIdReady(false);

														// Capture 429 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdTooManyRequests)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdTooManyRequests) !== -1
																	? prevState.splice(prevState.indexOf(siteIdTooManyRequests), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
													default:
														// Report 4XX error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdUnknownError]);

														// Update `isSiteIdReady` state to false
														setIsSiteIdReady(false);

														// Capture any errors within 4XX status codes range and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdUnknownError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdUnknownError) !== -1
																	? prevState.splice(prevState.indexOf(siteIdUnknownError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
												}
										  })()
										: null;
								} else if (Math.round(status / 500) === 1) {
									asPath.includes(DashboardRoute)
										? (() => {
												switch (status) {
													case 500:
														// Report 500 internal server error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdInternalServerError]);

														// Update `isSiteId` state to false
														setIsSiteIdReady(false);

														// Capture 500 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdInternalServerError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdInternalServerError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 502:
														// Report 502 bad gateway error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdBadGatewayError]);

														// Update `isSiteId` state to false
														setIsSiteIdReady(false);

														// Capture 502 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdBadGatewayError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdBadGatewayError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 503:
														// Report 503 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdServiceUnavailableError]);

														// Update `isSiteId` state to false
														setIsSiteIdReady(false);

														// Capture 503 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdServiceUnavailableError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdServiceUnavailableError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 504:
														// Report 504 bad request error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdGatewayTimeoutError]);

														// Update `isSiteId` state to false
														setIsSiteIdReady(false);

														// Capture 504 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdGatewayTimeoutError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdGatewayTimeoutError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													default:
														// Report 4XX error
														setSiteIdErrorMessage((prevState) => [...prevState, siteIdUnknownError]);

														// Update `isSiteId` state to false
														setIsSiteIdReady(false);

														// Capture any errors within 4XX status codes range and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																siteIdErrorMessage.find((message) => message === siteIdUnknownError)
															);
															Sentry.captureException(new Error(errorSiteId));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setSiteIdErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(siteIdUnknownError) !== -1
																	? prevState.splice(prevState.indexOf(siteIdUnknownError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
												}
										  })()
										: null;
								} else {
									// Report unknown error when not found
									setSiteIdErrorMessage((prevState) => [...prevState, siteIdUnknownError]);

									// Update `isSiteId` state to false
									setIsSiteIdReady(false);

									// Capture unknown errors and send to Sentry
									Sentry.configureScope((scope) => {
										scope.setTag("route", asPath);
										scope.setTag("status", status);
										scope.setTag(
											"message",
											siteIdErrorMessage.find((message) => message === siteIdUnknownError)
										);
										Sentry.captureException(new Error(errorSiteId));
									});

									// After the `RevalidationInterval` timer elapsed, remove the current error message
									setTimeout(() => {
										setSiteIdSuccessMessage((prevState) => [
											...prevState,
											prevState.indexOf(siteIdUnknownError) !== -1
												? prevState.splice(prevState.indexOf(siteIdUnknownError), 1)
												: null
										]);
									}, RevalidationInterval);
								}
						  })()
						: null;
			  })()
			: null;
	}, [
		siteId,
		validatingSiteId,
		errorSiteId,
		isSiteIdReady,
		siteIdData,
		status,
		asPath,
		siteIdErrorMessage,
		siteIdSuccessMessage
	]);

	return {
		siteId,
		mutateSiteId,
		errorSiteId,
		validatingSiteId,
		siteIdData,
		isSiteIdReady,
		siteIdErrorMessage,
		siteIdSuccessMessage
	};
};
