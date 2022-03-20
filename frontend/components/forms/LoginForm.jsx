import { GoogleLoginApiEndpoint, LoginApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval, RedirectInterval } from "@constants/GlobalValues";
import { DashboardSitesLink, ResetPasswordLink } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useShowPassword } from "@hooks/useShowPassword";
import { SiteCrawlerAppContext } from "@pages/_app";
import * as Sentry from "@sentry/nextjs";
import { classnames } from "@utils/classnames";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { useSWRConfig } from "swr";
import * as Yup from "yup";

/**
 * Custom function to render the `LoginForm` component
 */
const LoginForm = () => {
	// Translations
	const { t } = useTranslation();
	const username = t("common:userName");
	const password = t("common:password");
	const requiredField = t("common:requiredField");
	const showPassword = t("login:showPassword");
	const hidePassword = t("login:hidePassword");
	const rememberMe = t("login:rememberMe");
	const forgotPassword = t("login:forgotPassword");
	const signingIn = t("login:signingIn");
	const signIn = t("login:signIn");
	const continueWith = t("login:continueWith");
	const googleSignIn = t("login:googleSignIn");

	// Custom hooks
	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);

	// Custom context
	const { setConfig, isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle social login
	const handleSocialLogin = (e) => {
		e.preventDefault();

		return isComponentReady ? (async () => await handlePostMethod(GoogleLoginApiEndpoint))() : null;
	};

	return (
		<Formik
			initialValues={{
				username: "",
				password: ""
			}}
			validationSchema={Yup.object().shape({
				username: Yup.string().required(requiredField),
				password: Yup.string().required(requiredField)
			})}
			onSubmit={async (values, { isSubmitting, setSubmitting, resetForm }) => {
				// Form body values
				const body = {
					username: values.username,
					password: values.password
				};

				// FIXME: values.rememberme logic
				// if (values.rememberme === true) {
				// } else {
				// }

				const loginResponse = await handlePostMethod(LoginApiEndpoint, body);
				const loginResponseData = loginResponse?.data ?? null;
				const loginResponseStatus = loginResponse?.status ?? null;
				const loginResponseMethod = loginResponse?.config?.method ?? null;

				// Show alert message after failed response is issued
				setConfig({
					isLogin: true,
					method: loginResponseMethod,
					status: loginResponseStatus,
					isAlert: true,
					isNotification: false
				});

				const loginResponseTimeout = setTimeout(() => {
					if (loginResponseData && Math.round(loginResponseStatus / 200) === 1) {
						// Mutate `login` endpoint after successful 200 OK or 201 Created response is issued
						mutate(LoginApiEndpoint, { data: loginResponseData.key }, false);

						// Collect user data and send to Sentry
						Sentry.configureScope((scope) =>
							scope.setUser({
								id: loginResponseData?.id,
								username: loginResponseData?.username,
								email: loginResponseData?.email
							})
						);

						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setSubmitting(false);

						// Redirect to sites dashboard page after successful 200 OK response is established
						return setTimeout(() => {
							push(DashboardSitesLink);
						}, RedirectInterval);
					} else {
						// Disable submission and disable form as soon as 200 OK or 201 Created response was issued
						setSubmitting(false);
					}
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(loginResponseTimeout);
				};
			}}
		>
			{({ values, errors, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<>
					<form onSubmit={handleSubmit}>
						<div className="mt-1">
							<label htmlFor="username" className="block text-sm font-medium text-gray-700">
								{username}
							</label>
							<div className="mt-1">
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									disabled={isSubmitting}
									aria-disabled={isSubmitting}
									aria-hidden={isSubmitting}
									className={classnames(
										"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
										isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
										errors.username ? "border-red-300" : "border-gray-300"
									)}
									aria-describedby="username"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.username}
								/>
							</div>

							{errors.username ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.username}</span>
							) : null}
						</div>

						<div className="mt-6">
							<div className="flex items-center justify-between">
								<label htmlFor="password" className="block text-sm font-medium text-gray-700">
									{password}
								</label>
								<div className="text-xs">
									<button
										type="button"
										className={classnames(
											"cursor-pointer font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none",
											isSubmitting && "pointer-events-none cursor-not-allowed text-gray-500 opacity-50"
										)}
										onClick={() => setIsPasswordShown(!isPasswordShown)}
									>
										{isPasswordShown ? hidePassword : showPassword}
									</button>
								</div>
							</div>
							<div className="mt-1">
								<input
									ref={passwordRef}
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									disabled={isSubmitting}
									aria-disabled={isSubmitting}
									aria-hidden={isSubmitting}
									className={classnames(
										"block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
										isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50",
										errors.password ? "border-red-300" : "border-gray-300"
									)}
									aria-describedby="password"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
							</div>

							{errors.password ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errors.password}</span>
							) : null}
						</div>

						<div className="mt-6 flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="rememberme"
									name="rememberme"
									type="checkbox"
									disabled={isSubmitting}
									aria-disabled={isSubmitting}
									aria-hidden={isSubmitting}
									className={classnames(
										"h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
										isSubmitting && "pointer-events-none cursor-not-allowed bg-gray-300 opacity-50"
									)}
									aria-describedby="rememberme"
									onChange={handleChange}
									value={values.rememberme}
								/>
								<label htmlFor="rememberme" className="ml-2 block text-sm text-gray-900">
									{rememberMe}
								</label>
							</div>

							<div className="text-sm">
								<Link href={ResetPasswordLink} passHref>
									<a
										className={classnames(
											"cursor-pointer font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none",
											isSubmitting && "pointer-events-none cursor-not-allowed text-gray-500 opacity-50"
										)}
									>
										{forgotPassword}
									</a>
								</Link>
							</div>
						</div>

						<div className="mt-6">
							<span className="block w-full rounded-md shadow-sm">
								<button
									type="submit"
									disabled={isSubmitting}
									aria-disabled={isSubmitting}
									aria-hidden={isSubmitting}
									className={classnames(
										"flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
										isSubmitting
											? "pointer-events-none cursor-not-allowed bg-indigo-300 opacity-50"
											: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									)}
								>
									{isSubmitting ? signingIn : signIn}
								</button>
							</span>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm leading-5">
								<span className="bg-white px-2 text-gray-600">{continueWith}</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-1 gap-3">
							<form onSubmit={handleSocialLogin}>
								<div className="inline-flex w-full rounded-md shadow-sm">
									<button
										type="submit"
										title={googleSignIn}
										className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
									>
										<FontAwesomeIcon icon={["fab", "google"]} className="-ml-0.5 mr-3 h-4 w-4" />
										{googleSignIn}
									</button>
								</div>
							</form>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

/**
 * Memoized custom `LoginForm` component
 */
export const MemoizedLoginForm = memo(LoginForm);
