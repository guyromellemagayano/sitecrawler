import { DashboardRoute } from "@configs/GlobalValues";
import { SitesLink } from "@configs/PageLinks";
import { useSite } from "@hooks/useSite";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";

/**
 * Helper function to get the site object from the context
 *
 * @param {string} endpoint The endpoint to get the site from
 * @param {number} status The status code to return if the site is not found
 * @returns {object} The object containing the site
 */
export const handleSites = ({ endpoint = null, status = null }) => {
	const [isSiteReady, setIsSiteReady] = React.useState(false);
	const [siteData, setSiteData] = React.useState(null);
	const [errorMessage, setErrorMessage] = React.useState([]);

	const { site, mutateSite, validatingSite, errorSite } = useSite(endpoint ?? null);
	const { asPath } = useRouter();

	const { t } = useTranslation();
	const siteBadRequestError = t("componentAlerts:siteBadRequestError");
	const siteForbiddenError = t("componentAlerts:siteForbiddenError");
	const siteNotFoundError = t("componentAlerts:siteNotFoundError");
	const siteTooManyRequests = t("componentAlerts:siteTooManyRequests");
	const siteInternalServerError = t("componentAlerts:siteinternalServerError");
	const siteBadGatewayError = t("componentAlerts:siteBadGatewayError");
	const siteServiceUnavailableError = t("componentAlerts:siteServiceUnavailableError");
	const siteGatewayTimeoutError = t("componentAlerts:siteGatewayTimeoutError");
	const siteUnknownError = t("componentAlerts:siteUnknownError");

	React.useEffect(() => {
		!validatingSite
			? (() => {
					asPath.includes(DashboardRoute)
						? (() => {
								if (Math.round(status / 200) === 1) {
									setSiteData(site?.data ?? null);

									typeof siteData !== "undefined" || siteData !== null
										? setIsSiteReady(true)
										: (() => {
												setErrorMessage((errorMessage) => [...errorMessage, siteNotFoundError]);
												setIsSiteReady(false);

												// Capture 2XX errors and send to Sentry
												Sentry.configureScope((scope) => {
													scope.setTag("route", asPath);
													scope.setTag("status", status);
													scope.setTag(
														"message",
														errorMessage.find((message) => message === siteNotFoundError)
													);
													Sentry.captureException(new Error(errorSite));
												});

												// Mutate `sites` after this status code is received
												mutateSite(endpoint ?? null);
										  })();
								} else if (Math.round(status / 400) === 1) {
									switch (status) {
										case 400:
											setErrorMessage((errorMessage) => [...errorMessage, siteBadRequestError]);

											// Capture 400 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteBadRequestError)
												);
												Sentry.captureException(new Error(errorSite));
											});

											// Mutate `sites` after this status code is received
											mutateSite(endpoint ?? null);
											break;
										case 403:
											setErrorMessage((errorMessage) => [...errorMessage, siteForbiddenError]);

											// Capture 403 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteForbiddenError)
												);
												Sentry.captureException(new Error(errorSite));
											});

											// Redirect to sites dashboard page after this status code is received
											setTimeout(() => {
												router.push(SitesLink);
											}, RevalidationInterval);
											break;
										case 404:
											setErrorMessage((errorMessage) => [...errorMessage, siteNotFoundError]);

											// Capture 404 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteNotFoundError)
												);
												Sentry.captureException(new Error(errorSite));
											});

											// Redirect to sites dashboard page after this status code is received
											setTimeout(() => {
												router.push(SitesLink);
											}, RevalidationInterval);
											break;
										case 429:
											setErrorMessage((errorMessage) => [...errorMessage, siteTooManyRequests]);

											// Capture 429 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteTooManyRequests)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
										default:
											setErrorMessage((errorMessage) => [...errorMessage, siteUnknownError]);

											// Capture any errors within 4XX status codes range and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteUnknownError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
									}
								} else if (Math.round(status / 500) === 1) {
									switch (status) {
										case 500:
											setErrorMessage((errorMessage) => [...errorMessage, siteInternalServerError]);

											// Capture 500 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteInternalServerError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
										case 502:
											setErrorMessage((errorMessage) => [...errorMessage, siteBadGatewayError]);

											// Capture 502 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteBadGatewayError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
										case 503:
											setErrorMessage((errorMessage) => [...errorMessage, siteServiceUnavailableError]);

											// Capture 503 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteServiceUnavailableError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
										case 504:
											setErrorMessage((errorMessage) => [...errorMessage, siteGatewayTimeoutError]);

											// Capture 504 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteGatewayTimeoutError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
										default:
											setErrorMessage((errorMessage) => [...errorMessage, siteUnknownError]);

											// Capture any errors other than 2XX, 4XX, and 5XX status codes and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === siteUnknownError)
												);
												Sentry.captureException(new Error(errorSite));
											});
											break;
									}

									// Mutate `sites` after this status code is received
									mutateSite(endpoint ?? null);
								} else {
									setErrorMessage((errorMessage) => [...errorMessage, siteUnknownError]);

									// Capture any errors other than 2XX, 4XX, and 5XX status codes and send to Sentry
									Sentry.configureScope((scope) => {
										scope.setTag("route", asPath);
										scope.setTag("status", status);
										scope.setTag(
											"message",
											errorMessage.find((message) => message === siteUnknownError)
										);
										Sentry.captureException(new Error(errorSite));
									});
								}
						  })()
						: null;
			  })()
			: null;
	}, [site, validatingSite, errorSite, status, asPath]);

	return { validatingSite, isSiteReady, siteData, mutateSite, errorMessage };
};
