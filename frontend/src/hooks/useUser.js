import { DashboardRoute, HomeRoute, RedirectInterval, RevalidationInterval } from "@configs/GlobalValues";
import { LoginLink, SitesLink } from "@configs/PageLinks";
import useFetcher from "@hooks/useFetcher";
import * as Sentry from "@sentry/nextjs";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";

export const useUser = ({ endpoint = null, status = null }) => {
	const [userData, setUserData] = React.useState(null);
	const [isUserReady, setIsUserReady] = React.useState(false);
	const [disableLocalTime, setDisableLocalTime] = React.useState(false);
	const [userErrorMessage, setUserErrorMessage] = React.useState([]);
	const [userSuccessMessage, setUserSuccessMessage] = React.useState([]);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// Translations
	const { t } = useTranslation("common");
	const userOkSuccess = t("userOkSuccess");
	const userCreatedSuccess = t("userCreatedSuccess");
	const userBadRequestError = t("userBadRequestError");
	const userForbiddenError = t("userForbiddenError");
	const userNotFoundError = t("userNotFoundError");
	const userTooManyRequests = t("userTooManyRequests");
	const userInternalServerError = t("userInternalServerError");
	const userBadGatewayError = t("userBadGatewayError");
	const userServiceUnavailableError = t("userServiceUnavailableError");
	const userGatewayTimeoutError = t("userGatewayTimeoutError");
	const userUnknownError = t("userUnknownError");

	// SWR hook for `user`
	const {
		data: user,
		mutate: mutateUser,
		error: errorUser,
		isValidating: validatingUser
	} = useSWR(endpoint ?? null, useFetcher);

	React.useEffect(() => {
		!validatingUser
			? () => {
					typeof user !== "undefined" && user !== null
						? (() => {
								if (Math.round(status / 200) === 1) {
									typeof user?.data === "object" && Object.keys(user?.data).length > 0
										? (() => {
												// Update `userData` with an actual `user` data object
												setUserData(user?.data);

												// Update local time state if `userData` object actually exist
												userData?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

												// Report success when `user` is found
												setUserSuccessMessage((prevState) => [...prevState, userOkSuccess]);

												// Update `isUserReady` state to true
												setIsUserReady(true);

												// If current `asPath` does not include `/dashboard/` string, redirect all current routes to `/dashboard/sites/` route
												!asPath.includes(DashboardRoute) && isUserReady
													? (() => {
															setTimeout(() => {
																router.push(SitesLink);
															}, RedirectInterval);
													  })()
													: (() => {
															// Collect user data and send to Sentry
															Sentry.configureScope((scope) =>
																scope.setUser({
																	id: userData?.id,
																	username: userData?.username,
																	email: userData?.email
																})
															);

															// After the `RevalidationInterval` timer elapsed, remove the current success message
															setTimeout(() => {
																setUserSuccessMessage((prevState) => [
																	...prevState,
																	prevState.indexOf(userOkSuccess) !== -1
																		? prevState.splice(prevState.indexOf(userOkSuccess), 1)
																		: null
																]);
															}, RevalidationInterval);
													  })();
										  })()
										: (() => {
												// Report unknown error when not found
												setUserErrorMessage((prevState) => [...prevState, userUnknownError]);

												// Update `isUserReady` state to false
												setIsUserReady(false);

												// Capture unknown errors and send to Sentry
												Sentry.configureScope((scope) => {
													scope.setTag("route", asPath);
													scope.setTag("status", status);
													scope.setTag(
														"message",
														userErrorMessage.find((message) => message === userUnknownError)
													);
													Sentry.captureException(new Error(errorUser));
												});

												// After the `RevalidationInterval` timer elapsed, remove the current error message
												setTimeout(() => {
													setUserSuccessMessage((prevState) => [
														...prevState,
														prevState.indexOf(userUnknownError) !== -1
															? prevState.splice(prevState.indexOf(userUnknownError), 1)
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
														setUserErrorMessage((prevState) => [...prevState, userBadRequestError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 400 bad request errors and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userBadRequestError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message and mutate the current `user` endpoint
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
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
														// Report 403 bad request error
														setUserErrorMessage((prevState) => [...prevState, userForbiddenError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 403 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userForbiddenError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message and redirect all within dashboard routes to login route
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userForbiddenError) !== -1
																	? prevState.splice(prevState.indexOf(userForbiddenError), 1)
																	: null
															]);

															setTimeout(() => {
																router.push(LoginLink);
															}, RedirectInterval);
														}, RevalidationInterval);
														break;
													case 404:
														// Report 404 bad request error
														setUserErrorMessage((prevState) => [...prevState, userNotFoundError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 404 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userNotFoundError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message and redirect all within dashboard routes to login route
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userNotFoundError) !== -1
																	? prevState.splice(prevState.indexOf(userNotFoundError), 1)
																	: null
															]);

															setTimeout(() => {
																router.push(LoginLink);
															}, RedirectInterval);
														}, RevalidationInterval);
														break;
													case 429:
														// Report 429 bad request error
														setUserErrorMessage((prevState) => [...prevState, userTooManyRequests]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 429 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userTooManyRequests)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userTooManyRequests) !== -1
																	? prevState.splice(prevState.indexOf(userTooManyRequests), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
													default:
														// Report 4XX error
														setUserErrorMessage((prevState) => [...prevState, userUnknownError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture any errors within 4XX status codes range and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userUnknownError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userUnknownError) !== -1
																	? prevState.splice(prevState.indexOf(userUnknownError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
												}
										  })()
										: HomeRoute === asPath
										? (() => {
												// If current `asPath` is equal to `HomeRoute`, redirect to login route immediately
												setTimeout(() => {
													router.push(LoginLink);
												}, RedirectInterval);
										  })()
										: null;
								} else if (Math.round(status / 500) === 1) {
									asPath.includes(DashboardRoute)
										? (() => {
												switch (status) {
													case 500:
														// Report 500 internal server error
														setUserErrorMessage((prevState) => [...prevState, userInternalServerError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 500 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userInternalServerError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userInternalServerError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 502:
														// Report 502 bad gateway error
														setUserErrorMessage((prevState) => [...prevState, userBadGatewayError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 502 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userBadGatewayError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userBadGatewayError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 503:
														// Report 503 bad request error
														setUserErrorMessage((prevState) => [...prevState, userServiceUnavailableError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 503 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userServiceUnavailableError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userServiceUnavailableError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													case 504:
														// Report 504 bad request error
														setUserErrorMessage((prevState) => [...prevState, userGatewayTimeoutError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture 504 error status code and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userGatewayTimeoutError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userGatewayTimeoutError).splice(0, 0)
															]);
														}, RevalidationInterval);
														break;
													default:
														// Report 4XX error
														setUserErrorMessage((prevState) => [...prevState, userUnknownError]);

														// Update `isUserReady` state to false
														setIsUserReady(false);

														// Capture any errors within 4XX status codes range and send to Sentry
														Sentry.configureScope((scope) => {
															scope.setTag("route", asPath);
															scope.setTag("status", status);
															scope.setTag(
																"message",
																userErrorMessage.find((message) => message === userUnknownError)
															);
															Sentry.captureException(new Error(errorUser));
														});

														// After the `RevalidationInterval` timer elapsed, remove the current error message
														setTimeout(() => {
															setUserErrorMessage((prevState) => [
																...prevState,
																prevState.indexOf(userUnknownError) !== -1
																	? prevState.splice(prevState.indexOf(userUnknownError), 1)
																	: null
															]);
														}, RevalidationInterval);
														break;
												}
										  })()
										: HomeRoute === asPath
										? (() => {
												// If current `asPath` is equal to `HomeRoute`, redirect to login route immediately
												setTimeout(() => {
													router.push(LoginLink);
												}, RedirectInterval);
										  })()
										: null;
								} else {
									// Report unknown error when not found
									setUserErrorMessage((prevState) => [...prevState, userUnknownError]);

									// Update `isUserReady` state to false
									setIsUserReady(false);

									// Capture unknown errors and send to Sentry
									Sentry.configureScope((scope) => {
										scope.setTag("route", asPath);
										scope.setTag("status", status);
										scope.setTag(
											"message",
											userErrorMessage.find((message) => message === userUnknownError)
										);
										Sentry.captureException(new Error(errorUser));
									});

									// After the `RevalidationInterval` timer elapsed, remove the current error message
									setTimeout(() => {
										setUserSuccessMessage((prevState) => [
											...prevState,
											prevState.indexOf(userUnknownError) !== -1
												? prevState.splice(prevState.indexOf(userUnknownError), 1)
												: null
										]);
									}, RevalidationInterval);
								}
						  })()
						: null;
			  }
			: null;
	}, [user, validatingUser, errorUser, isUserReady, userData, status, asPath, userErrorMessage, userSuccessMessage]);

	return {
		user,
		mutateUser,
		errorUser,
		validatingUser,
		userData,
		isUserReady,
		disableLocalTime,
		userErrorMessage,
		userSuccessMessage
	};
};
