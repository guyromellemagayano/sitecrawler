import { DashboardRoute, HomeRoute, RedirectInterval, RevalidationInterval } from "@configs/GlobalValues";
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
	const [successMessage, setSuccessMessage] = React.useState([]);
	const [errorMessage, setErrorMessage] = React.useState([]);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);

	const { user, mutateUser, validatingUser, errorUser } = useUser(endpoint ?? null);
	const { asPath } = useRouter();
	const router = useRouter();

	const { t } = useTranslation("common");
	const userBadRequestError = t("userBadRequestError");
	const userForbiddenError = t("userForbiddenError");
	const userNotFoundError = t("userNotFoundError");
	const userTooManyRequests = t("userTooManyRequests");
	const userInternalServerError = t("userInternalServerError");
	const userBadGatewayError = t("userBadGatewayError");
	const userServiceUnavailableError = t("userServiceUnavailableError");
	const userGatewayTimeoutError = t("userGatewayTimeoutError");
	const userUnknownError = t("userUnknownError");

	React.useEffect(() => {
		!validatingUser
			? () => {
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
												setErrorMessage((prevState) => [...prevState, userNotFoundError]);
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

												setTimeout(() => {
													setSuccessMessage((prevState) => [
														...prevState,
														prevState.indexOf(userNotFoundError) !== -1
															? prevState.splice(prevState.indexOf(userNotFoundError), 1)
															: null
													]);
												}, RevalidationInterval);
										  })();
							  })()
							: (() => {
									setIsUserReady(true);

									setTimeout(() => {
										router.push(SitesLink);
									}, RedirectInterval);
							  })();
					} else if (Math.round(status / 400) === 1) {
						asPath.includes(DashboardRoute)
							? (() => {
									switch (status) {
										case 400:
											setErrorMessage((prevState) => [...prevState, userBadRequestError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userBadRequestError) !== -1
														? prevState.splice(prevState.indexOf(userBadRequestError), 1)
														: null
												]);

												// Mutate `user` after this status code is received
												mutateUser(endpoint ?? null);
											}, RevalidationInterval);
											break;
										case 403:
											setErrorMessage((prevState) => [...prevState, userForbiddenError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userForbiddenError) !== -1
														? prevState.splice(prevState.indexOf(userForbiddenError), 1)
														: null
												]);

												// Redirect to login page after this status code is received
												setTimeout(() => {
													router.push(LoginLink);
												}, RedirectInterval);
											}, RevalidationInterval);
											break;
										case 404:
											setErrorMessage((prevState) => [...prevState, userNotFoundError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userNotFoundError) !== -1
														? prevState.splice(prevState.indexOf(userNotFoundError), 1)
														: null
												]);

												// Redirect to login page after this status code is received
												setTimeout(() => {
													router.push(LoginLink);
												}, RedirectInterval);
											}, RevalidationInterval);
											break;
										case 429:
											setErrorMessage((prevState) => [...prevState, userTooManyRequests]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userTooManyRequests) !== -1
														? prevState.splice(prevState.indexOf(userTooManyRequests), 1)
														: null
												]);

												// Mutate `user` after this status code is received
												mutateUser(endpoint ?? null);
											}, RevalidationInterval);
											break;
										default:
											setErrorMessage((prevState) => [...prevState, userUnknownError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userUnknownError) !== -1
														? prevState.splice(prevState.indexOf(userUnknownError), 1)
														: null
												]);
											}, RevalidationInterval);
											break;
									}
							  })()
							: (() => {
									setIsUserReady(false);

									if (HomeRoute === asPath) {
										setTimeout(() => {
											router.push(LoginLink);
										}, RedirectInterval);
									}

									return null;
							  })();
					} else if (Math.round(status / 500) === 1) {
						asPath.includes(DashboardLink)
							? (() => {
									switch (status) {
										case 500:
											setErrorMessage((prevState) => [...prevState, userInternalServerError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userInternalServerError).splice(0, 0)
												]);
											}, RevalidationInterval);
											break;
										case 502:
											setErrorMessage((prevState) => [...prevState, userBadGatewayError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userBadGatewayError).splice(0, 0)
												]);
											}, RevalidationInterval);
											break;
										case 503:
											setErrorMessage((prevState) => [...prevState, userServiceUnavailableError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userServiceUnavailableError).splice(0, 0)
												]);
											}, RevalidationInterval);
											break;
										case 504:
											setErrorMessage((prevState) => [...prevState, userGatewayTimeoutError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userGatewayTimeoutError).splice(0, 0)
												]);
											}, RevalidationInterval);
											break;
										default:
											setErrorMessage((prevState) => [...prevState, userUnknownError]);
											setIsUserReady(false);

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

											setTimeout(() => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(userUnknownError).splice(0, 0)
												]);
											}, RevalidationInterval);
											break;
									}

									setTimeout(() => {
										// Mutate `sites` after this status code is received
										mutateUser(endpoint ?? null);
									}, RevalidationInterval);
							  })()
							: (() => {
									setIsUserReady(false);

									if (HomeRoute === asPath) {
										setTimeout(() => {
											router.push(LoginLink);
										}, RedirectInterval);
									}

									return null;
							  })();
					} else {
						setErrorMessage((prevState) => [...prevState, userUnknownError]);
						setIsUserReady(false);

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

						setTimeout(() => {
							setErrorMessage((prevState) => [
								...prevState,
								prevState.indexOf(userUnknownError) !== -1
									? prevState.splice(prevState.indexOf(userUnknownError), 1)
									: null
							]);
						}, RevalidationInterval);
					}
			  }
			: null;
	}, [user, validatingUser, errorUser, status, asPath]);

	return {
		validatingUser,
		isUserReady,
		userData,
		mutateUser,
		disableLocalTime,
		successMessage,
		setSuccessMessage,
		errorMessage,
		setErrorMessage
	};
};
