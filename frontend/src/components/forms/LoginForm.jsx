import { LoginApiEndpoint } from "@configs/ApiEndpoints";
import { RedirectInterval, RevalidationInterval } from "@configs/GlobalValues";
import { SitesLink } from "@configs/PageLinks";
import { SocialLoginLinks } from "@configs/SocialLogin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePostMethod } from "@hooks/useHttpMethod";
import { useShowPassword } from "@hooks/useShowPassword";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import tw from "twin.macro";
import * as Yup from "yup";

const LoginForm = ({ setErrorMessage, setSuccessMessage }) => {
	const [disableLoginForm, setDisableLoginForm] = React.useState(false);

	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);
	const router = useRouter();

	const { t } = useTranslation("login");
	const username = t("username");
	const password = t("password");
	const requiredField = t("requiredField");
	const showPassword = t("showPassword");
	const hidePassword = t("hidePassword");
	const rememberMe = t("rememberMe");
	const forgotPassword = t("forgotPassword");
	const signingIn = t("signingIn");
	const signIn = t("signIn");
	const continueWith = t("continueWith");
	const loginOkSuccess = t("loginOkSuccess");
	const loginFailed = t("loginFailed");

	const linksArray = SocialLoginLinks();

	React.useEffect(() => {
		router.prefetch(SitesLink);
	}, []);

	return (
		<React.Fragment>
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
					const body = {
						username: values.username,
						password: values.password
					};

					// FIXME: values.rememberme logic
					// if (values.rememberme === true) {
					// } else {
					// }

					const response = await usePostMethod(LoginApiEndpoint, body);
					const data = response?.data ?? null;
					const status = response?.status ?? null;

					switch (status) {
						case 200:
							setSubmitting(false);
							setDisableLoginForm(!disableLoginForm);

							if (typeof data !== "undefined" && data !== null) {
								setSuccessMessage((prevState) => [...prevState, loginOkSuccess]);

								setTimeout(() => {
									router.push(SitesLink);
								}, RedirectInterval);
							} else {
								resetForm({ values: "" });
								setSubmitting(false);
								setErrorMessage((prevState) => [...prevState, loginFailed]);

								setTimeout(() => {
									setErrorMessage((prevState) => [
										...prevState,
										prevState.indexOf(loginFailed) !== -1 ? prevState.splice(prevState.indexOf(loginFailed), 1) : null
									]);
								}, RevalidationInterval);
							}
							break;
						default:
							data
								? (() => {
										resetForm({ values: "" });
										setSubmitting(false);

										data?.non_field_errors?.map((message) => {
											setErrorMessage((prevState) => [...prevState, message]);
										});

										setTimeout(() => {
											data?.non_field_errors?.map((message) => {
												setErrorMessage((prevState) => [
													...prevState,
													prevState.indexOf(message) !== -1 ? prevState.splice(prevState.indexOf(message), 1) : null
												]);
											});
										}, RevalidationInterval);
								  })()
								: (() => {
										resetForm({ values: "" });
										setSubmitting(false);
										setErrorMessage((prevState) => [...prevState, loginFailed]);

										setTimeout(() => {
											setErrorMessage((prevState) => [
												...prevState,
												prevState.indexOf(loginFailed) !== -1
													? prevState.splice(prevState.indexOf(loginFailed), 1)
													: null
											]);
										}, RevalidationInterval);
								  })();
							break;
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

LoginForm.propTypes = {
	setErrorMessage: PropTypes.func,
	setSuccessMessage: PropTypes.func
};

export default LoginForm;
