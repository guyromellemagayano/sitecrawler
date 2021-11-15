import Alert from "@components/alerts";
import { LoginApiEndpoint, UserApiEndpoint } from "@configs/ApiEndpoints";
import { RevalidationInterval } from "@configs/GlobalValues";
import { SitesLink } from "@configs/PageLinks";
import { SocialLoginLinks } from "@configs/SocialLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePostMethod } from "@hooks/useHttpMethod";
import { useShowPassword } from "@hooks/useShowPassword";
import * as Sentry from "@sentry/nextjs";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
import * as Yup from "yup";

const LoginForm = (status, data) => {
	const [disableLoginForm, setDisableLoginForm] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState([]);
	const [successMessage, setSuccessMessage] = React.useState([]);

	// Show password hook
	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Translations
	const { t } = useTranslation();
	const username = t("common:username");
	const password = t("common:password");
	const requiredField = t("common:requiredField");
	const showPassword = t("login:showPassword");
	const hidePassword = t("login:hidePassword");
	const rememberMe = t("login:rememberMe");
	const forgotPassword = t("login:forgotPassword");
	const signingIn = t("login:signingIn");
	const signIn = t("login:signIn");
	const continueWith = t("login:continueWith");
	const userOkSuccess = t("alerts:userOkSuccess");
	const userBadRequestPostError = t("alerts:userBadRequestPostError");
	const userForbiddenPostError = t("alerts:userForbiddenPostError");
	const userNotFoundPostError = t("alerts:userNotFoundPostError");
	const userTooManyRequestsPostError = t("alerts:userTooManyRequestsPostError");
	const userInternalServerPostError = t("alerts:userInternalServerPostError");
	const userBadGatewayPostError = t("alerts:userBadGatewayPostError");
	const userServiceUnavailablePostError = t("alerts:userServiceUnavailablePostError");
	const userGatewayTimeoutPostError = t("alerts:userGatewayTimeoutPostError");
	const userUnknownError = t("alerts:userUnknownError");

	// Social media links array
	const linksArray = SocialLoginLinks();

	// Prefetch sites page for faster loading
	React.useEffect(() => {
		router.prefetch(SitesLink);
	}, []);

	return (
		<React.Fragment>
			{errorMessage && errorMessage.length > 0
				? errorMessage.map((value, key) => <Alert key={key} message={value} isError />)
				: null}

			{successMessage && successMessage.length > 0
				? successMessage.map((value, key) => <Alert key={key} message={value} isSuccess />)
				: null}

			<Formik
				initialValues={{
					username: "",
					password: ""
				}}
				validationSchema={Yup.object({
					username: Yup.string().required(requiredField),
					password: Yup.string().required(requiredField)
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					// Form body values
					const body = {
						username: values.username,
						password: values.password
					};

					// FIXME: values.rememberme logic
					// if (values.rememberme === true) {
					// } else {
					// }

					const loginResponse = await usePostMethod(LoginApiEndpoint, body);
					const loginResponseData = loginResponse.data ?? null;
					const loginResponseStatus = loginResponse.status ?? null;

					if (loginResponseData !== null && Math.round(loginResponseStatus / 200) === 1) {
						// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
						mutate(UserApiEndpoint, false);

						// Collect user data and send to Sentry
						Sentry.configureScope((scope) =>
							scope.setUser({
								id: loginResponseData?.id,
								username: loginResponseData?.username,
								email: loginResponseData?.email
							})
						);

						// Disable submission as soon as 200 OK or 201 Created response is issued
						setSubmitting(false);
						setDisableLoginForm(!disableLoginForm);
						setSuccessMessage((prevState) => [...prevState, userOkSuccess]);

						setTimeout(() => {
							setSuccessMessage((prevState) => [
								...prevState,
								prevState.indexOf(userOkSuccess) !== -1 ? prevState.splice(prevState.indexOf(userOkSuccess), 1) : null
							]);

							// Redirect to sites dashboard page after successful 200 OK response is established
							setTimeout(() => {
								router.push(SitesLink);
							}, RedirectInterval);
						}, RevalidationInterval);
					} else {
						let errorStatusCodeMessage = "";

						resetForm({ values: "" });
						setSubmitting(false);

						switch (loginResponseStatus) {
							case 400:
								errorStatusCodeMessage = userBadRequestPostError;
								break;
							case 403:
								errorStatusCodeMessage = userForbiddenPostError;
								break;
							case 404:
								errorStatusCodeMessage = userNotFoundPostError;
								break;
							case 429:
								errorStatusCodeMessage = userTooManyRequestsPostError;
								break;
							case 500:
								errorStatusCodeMessage = userInternalServerPostError;
								break;
							case 502:
								errorStatusCodeMessage = userBadGatewayPostError;
								break;
							case 503:
								errorStatusCodeMessage = userServiceUnavailablePostError;
								break;
							case 504:
								errorStatusCodeMessage = userGatewayTimeoutPostError;
								break;
							default:
								errorStatusCodeMessage = userUnknownError;
								break;
						}

						setErrorMessage((prevState) => [...prevState, errorStatusCodeMessage]);

						// Capture unknown errors and send to Sentry
						Sentry.configureScope((scope) => {
							scope.setTag("route", asPath);
							scope.setTag("status", loginResponseStatus);
							scope.setTag(
								"message",
								errorMessage.find((message) => message === errorStatusCodeMessage)
							);
							Sentry.captureException(new Error(loginResponse));
						});

						setTimeout(() => {
							setErrorMessage((prevState) => [
								...prevState,
								prevState.indexOf(errorStatusCodeMessage) !== -1
									? prevState.splice(prevState.indexOf(errorStatusCodeMessage), 1)
									: null
							]);
						}, RevalidationInterval);
					}
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
					<React.Fragment>
						<form onSubmit={handleSubmit}>
							<div tw="mt-1">
								<label htmlFor="username" tw="block text-sm font-medium text-gray-700">
									{username}
								</label>
								<div tw="mt-1">
									<input
										id="username"
										name="username"
										type="text"
										autoComplete="username"
										autoFocus={true}
										disabled={isSubmitting || disableLoginForm}
										css={[
											tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
											(isSubmitting || disableLoginForm) &&
												tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
											errors.username ? tw`border-red-300` : tw`border-gray-300`
										]}
										aria-describedby="username"
										onChange={handleChange}
										value={values.username}
									/>
								</div>

								{errors.username && touched.username && (
									<span tw="block mt-2 text-xs leading-5 text-red-700">
										{errors.username && touched.username && errors.username}
									</span>
								)}
							</div>

							<div tw="mt-6">
								<div tw="flex items-center justify-between">
									<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
										{password}
									</label>
									<div tw="text-xs">
										<button
											type="button"
											css={[
												tw`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none cursor-pointer`,
												(isSubmitting || disableLoginForm) &&
													tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
											]}
											onClick={() => setIsPasswordShown(!isPasswordShown)}
										>
											{isPasswordShown ? hidePassword : showPassword}
										</button>
									</div>
								</div>
								<div tw="mt-1">
									<input
										ref={passwordRef}
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										disabled={isSubmitting || disableLoginForm}
										css={[
											tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
											(isSubmitting || disableLoginForm) &&
												tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
											errors.password ? tw`border-red-300` : tw`border-gray-300`
										]}
										aria-describedby="password"
										onChange={handleChange}
										value={values.password}
									/>
								</div>

								{errors.password && touched.password && (
									<span tw="block mt-2 text-xs leading-5 text-red-700">
										{errors.password && touched.password && errors.password}
									</span>
								)}
							</div>

							<div tw="mt-6 flex items-center justify-between">
								<div tw="flex items-center">
									<input
										id="rememberme"
										name="rememberme"
										type="checkbox"
										disabled={isSubmitting || disableLoginForm}
										css={[
											tw`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded`,
											(isSubmitting || disableLoginForm) &&
												tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`
										]}
										aria-describedby="rememberme"
										onChange={handleChange}
										value={values.rememberme}
									/>
									<label htmlFor="rememberme" tw="ml-2 block text-sm text-gray-900">
										{rememberMe}
									</label>
								</div>

								<div tw="text-sm">
									<Link href="/reset-password">
										<a
											css={[
												tw`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 cursor-pointer`,
												(isSubmitting || disableLoginForm) &&
													tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
											]}
										>
											{forgotPassword}
										</a>
									</Link>
								</div>
							</div>

							<div tw="mt-6">
								<span tw="block w-full rounded-md shadow-sm">
									<button
										type="submit"
										disabled={isSubmitting || disableLoginForm}
										css={[
											tw`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600`,
											isSubmitting || disableLoginForm
												? tw`opacity-50 bg-indigo-300 cursor-not-allowed pointer-events-none`
												: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
									>
										{isSubmitting || disableLoginForm ? signingIn : signIn}
									</button>
								</span>
							</div>
						</form>

						<div tw="mt-6">
							<div tw="relative">
								<div tw="absolute inset-0 flex items-center">
									<div tw="w-full border-t border-gray-300"></div>
								</div>
								<div tw="relative flex justify-center text-sm leading-5">
									<span tw="px-2 bg-white text-gray-600">{continueWith}</span>
								</div>
							</div>

							<div tw="mt-6 grid grid-cols-1 gap-3">
								{linksArray.map((links, key) => {
									return (
										<div key={key}>
											<span tw="w-full inline-flex rounded-md shadow-sm">
												<a
													href={links.href}
													disabled={links.disabled}
													title={links.label}
													css={[
														tw`w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500`,
														links.disabled
															? tw`bg-gray-300 opacity-50 cursor-not-allowed pointer-events-none`
															: tw`bg-white`,
														isSubmitting || disableLoginForm
															? tw`bg-gray-300 cursor-not-allowed pointer-events-none`
															: tw`hover:bg-gray-50`
													]}
												>
													<FontAwesomeIcon icon={links.icon} tw="-ml-0.5 w-4 h-4 mr-3" />
													{links.label}
												</a>
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</React.Fragment>
				)}
			</Formik>
		</React.Fragment>
	);
};

export default LoginForm;
