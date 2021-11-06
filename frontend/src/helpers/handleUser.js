import { DashboardRoute, RevalidationInterval } from "@configs/GlobalValues";
import { DashboardLink, LoginLink, SitesLink } from "@configs/PageLinks";
import { useUser } from "@hooks/useUser";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";

/**
 * Helper function to check if user is logged in
 *
 * @param {string} endpoint The endpoint to get the user from
 * @param {number} status The status code to check for
 * @returns {object} The object containing the user
 */
export const handleUser = ({ endpoint = null, status = null }) => {
	const [isUserReady, setIsUserReady] = React.useState(false);
	const [userData, setUserData] = React.useState(null);
	const [errorMessage, setErrorMessage] = React.useState([]);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);

	const { user, mutateUser, validatingUser, errorUser } = useUser(endpoint ?? null);
	const { asPath } = useRouter();
	const router = useRouter();

	const { t } = useTranslation();
	const userBadRequestError = t("componentAlerts:userBadRequestError");
	const userForbiddenError = t("componentAlerts:userForbiddenError");
	const userNotFoundError = t("componentAlerts:userNotFoundError");
	const userTooManyRequests = t("componentAlerts:userTooManyRequests");
	const userInternalServerError = t("componentAlerts:userinternalServerError");
	const userBadGatewayError = t("componentAlerts:userBadGatewayError");
	const userServiceUnavailableError = t("componentAlerts:userServiceUnavailableError");
	const userGatewayTimeoutError = t("componentAlerts:userGatewayTimeoutError");
	const userUnknownError = t("componentAlerts:userUnknownError");

	React.useEffect(() => {
		!validatingUser
			? (() => {
					if (Math.round(status / 200) === 1) {
						asPath.includes(DashboardRoute)
							? (() => {
									setUserData(user?.data ?? null);

									typeof userData !== "undefined" || userData !== null
										? (() => {
												// Update local time state if `userData` is not null or undefined
												userData?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

												setIsUserReady(true);

												// Collect user data and send to Sentry
												Sentry.configureScope((scope) =>
													scope.setUser({
														id: userData?.id ?? null,
														username: userData?.username ?? null,
														email: userData?.email ?? null
													})
												);
										  })()
										: (() => {
												setErrorMessage((errorMessage) => [...errorMessage, userNotFoundError]);
												setIsUserReady(false);

												// Capture 2XX errors and send to Sentry
												Sentry.configureScope((scope) => {
													scope.setTag("route", asPath);
													scope.setTag("status", status);
													scope.setTag(
														"message",
														errorMessage.find((message) => message === userNotFoundError)
													);
													Sentry.captureException(new Error(errorUser));
												});
										  })();

									// Mutate `sites` after this status code is received
									mutateUser(endpoint ?? null);
							  })()
							: router.push(SitesLink);
					} else if (Math.round(status / 400) === 1) {
						asPath.includes(DashboardRoute)
							? (() => {
									switch (status) {
										case 400:
											setErrorMessage((errorMessage) => [...errorMessage, userBadRequestError]);

											// Capture 400 errors and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userBadRequestError)
												);
												Sentry.captureException(new Error(errorUser));
											});

											// Mutate `user` after this status code is received
											mutateUser(endpoint ?? null);
											break;
										case 403:
											setErrorMessage((errorMessage) => [...errorMessage, userForbiddenError]);

											// Capture 403 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userForbiddenError)
												);
												Sentry.captureException(new Error(errorUser));
											});

											// Redirect to login page after this status code is received
											setTimeout(() => {
												router.push(LoginLink);
											}, RevalidationInterval);
											break;
										case 404:
											setErrorMessage((errorMessage) => [...errorMessage, userNotFoundError]);

											// Capture 404 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userNotFoundError)
												);
												Sentry.captureException(new Error(errorUser));
											});

											// Redirect to login page after this status code is received
											setTimeout(() => {
												router.push(LoginLink);
											}, RevalidationInterval);
											break;
										case 429:
											setErrorMessage((errorMessage) => [...errorMessage, userTooManyRequests]);

											// Capture 429 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userTooManyRequests)
												);
												Sentry.captureException(new Error(errorUser));
											});

											// Mutate `user` after this status code is received
											mutateUser(endpoint ?? null);
											break;
										default:
											setErrorMessage((errorMessage) => [...errorMessage, userUnknownError]);

											// Capture any errors within 4XX status codes range and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userUnknownError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
									}
							  })()
							: null;
					} else if (Math.round(status / 500) === 1) {
						asPath.includes(DashboardLink)
							? (() => {
									switch (status) {
										case 500:
											setErrorMessage((errorMessage) => [...errorMessage, userInternalServerError]);

											// Capture 500 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userInternalServerError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
										case 502:
											setErrorMessage((errorMessage) => [...errorMessage, userBadGatewayError]);

											// Capture 502 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userBadGatewayError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
										case 503:
											setErrorMessage((errorMessage) => [...errorMessage, userServiceUnavailableError]);

											// Capture 503 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userServiceUnavailableError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
										case 504:
											setErrorMessage((errorMessage) => [...errorMessage, userGatewayTimeoutError]);

											// Capture 504 error status code and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userGatewayTimeoutError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
										default:
											setErrorMessage((errorMessage) => [...errorMessage, userUnknownError]);

											// Capture any errors other than 2XX, 4XX, and 5XX status codes and send to Sentry
											Sentry.configureScope((scope) => {
												scope.setTag("route", asPath);
												scope.setTag("status", status);
												scope.setTag(
													"message",
													errorMessage.find((message) => message === userUnknownError)
												);
												Sentry.captureException(new Error(errorUser));
											});
											break;
									}

									// Mutate `sites` after this status code is received
									mutateUser(endpoint ?? null);
							  })()
							: null;
					} else {
						setErrorMessage((errorMessage) => [...errorMessage, userUnknownError]);

						// Capture any errors other than 2XX, 4XX, and 5XX status codes and send to Sentry
						Sentry.configureScope((scope) => {
							scope.setTag("route", asPath);
							scope.setTag("status", status);
							scope.setTag(
								"message",
								errorMessage.find((message) => message === userUnknownError)
							);
							Sentry.captureException(new Error(errorUser));
						});
					}
			  })()
			: null;
	}, [user, validatingUser, errorUser, status, asPath]);

	return { validatingUser, isUserReady, userData, mutateUser, disableLocalTime, errorMessage };
};
