import { LoginApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { RedirectInterval } from "@constants/GlobalValues";
import { DashboardSitesLink, ResetPasswordLink } from "@constants/PageLinks";
import { SocialLoginLinks } from "@constants/SocialLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useShowPassword } from "@hooks/useShowPassword";
import { SiteCrawlerAppContext } from "@pages/_app";
import * as Sentry from "@sentry/nextjs";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import { useSWRConfig } from "swr";
import tw from "twin.macro";
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

	// Social media links array
	const linksArray = SocialLoginLinks();

	// Custom hooks
	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Router
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	return (
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

				const loginResponse = await handlePostMethod(LoginApiEndpoint, body);
				const loginResponseData = loginResponse?.data ?? null;
				const loginResponseStatus = loginResponse?.status ?? null;
				const loginResponseMethod = loginResponse?.config?.method ?? null;

				if (loginResponseData !== null && Math.round(loginResponseStatus / 200) === 1) {
					// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
					await mutate(UserApiEndpoint, loginResponseData?.key ?? null, false);

					// Collect user data and send to Sentry
					Sentry.configureScope((scope) =>
						scope.setUser({
							id: loginResponseData?.id,
							username: loginResponseData?.username,
							email: loginResponseData?.email
						})
					);

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isLogin: true,
						method: loginResponseMethod,
						status: loginResponseStatus
					});

					// Redirect to sites dashboard page after successful 200 OK response is established
					setTimeout(() => {
						router.push(DashboardSitesLink);
					}, RedirectInterval);

					// Reenable submission as soon as 200 OK or 201 Created response is issued
					setSubmitting(false);
				} else {
					// Show alert message after failed response is issued
					setConfig({
						isLogin: true,
						method: loginResponseMethod,
						status: loginResponseStatus
					});

					// Reenable submission and reset form as soon as 200 OK or 201 Created response was not issued
					setSubmitting(false);
					resetForm({ values: "" });
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
				<>
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
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.username ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="username"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.username}
								/>
							</div>

							{errors.username || touched.username ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.username || touched.username}</span>
							) : null}
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
											isSubmitting && tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
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
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.password ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
							</div>

							{errors.password || touched.password ? (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password || touched.password}</span>
							) : null}
						</div>

						<div tw="mt-6 flex items-center justify-between">
							<div tw="flex items-center">
								<input
									id="rememberme"
									name="rememberme"
									type="checkbox"
									disabled={isSubmitting}
									css={[
										tw`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`
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
								<Link href={ResetPasswordLink} passHref>
									<a
										css={[
											tw`font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150 cursor-pointer`,
											isSubmitting && tw`opacity-50 text-gray-500 cursor-not-allowed pointer-events-none`
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
									disabled={isSubmitting}
									css={[
										tw`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600`,
										isSubmitting
											? tw`opacity-50 bg-indigo-300 cursor-not-allowed pointer-events-none`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
								>
									{isSubmitting ? signingIn : signIn}
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
													isSubmitting ? tw`bg-gray-300 cursor-not-allowed pointer-events-none` : tw`hover:bg-gray-50`
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
				</>
			)}
		</Formik>
	);
};

/**
 * Memoized custom `LoginForm` component
 */
export const MemoizedLoginForm = memo(LoginForm);
