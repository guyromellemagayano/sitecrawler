import { DashboardRoute, RevalidationInterval } from "@configs/GlobalValues";
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
	const [successMessage, setSuccessMessage] = React.useState([]);

	const { site, mutateSite, validatingSite, errorSite } = useSite(endpoint ?? null);
	const { asPath } = useRouter();
	const router = useRouter();

	const { t } = useTranslation("common");
	const siteOkSuccess = t("siteOkSuccess");
	const siteCreatedSuccess = t("siteCreatedSuccess");
	const siteBadRequestError = t("siteBadRequestError");
	const siteForbiddenError = t("siteForbiddenError");
	const siteNotFoundError = t("siteNotFoundError");
	const siteTooManyRequests = t("siteTooManyRequests");
	const siteInternalServerError = t("siteInternalServerError");
	const siteBadGatewayError = t("siteBadGatewayError");
	const siteServiceUnavailableError = t("siteServiceUnavailableError");
	const siteGatewayTimeoutError = t("siteGatewayTimeoutError");
	const siteUnknownError = t("siteUnknownError");

	React.useEffect(() => {
		!validatingSite
			? (() => {
					asPath.includes(DashboardRoute)
						? (() => {
								if (Math.round(status / 200) === 1) {
									setSiteData(site?.data ?? null);

									typeof siteData !== "undefined" || siteData !== null
										? (() => {
												switch (status) {
													case 200:
														setSuccessMessage((successMessage) => [...successMessage, siteOkSuccess]);
														break;
													case 201:
														setSuccessMessage((successMessage) => [...successMessage, siteCreatedSuccess]);
														break;
													default:
														break;
												}

												setIsSiteReady(true);
										  })()
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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
											setIsSiteReady(false);

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
									setIsSiteReady(false);

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

	return {
		validatingSite,
		isSiteReady,
		siteData,
		mutateSite,
		successMessage,
		setSuccessMessage,
		errorMessage,
		setErrorMessage
	};
};
