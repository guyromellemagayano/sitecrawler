import { ErrorMessageAlert } from "@components/alerts/ErrorMessageAlert";
import { SuccessMessageAlert } from "@components/alerts/SuccessMessageAlert";
import { RedirectInterval } from "@configs/GlobalValues";
import { SocialLoginLinks } from "@configs/SocialLogin";
import { LoginApiEndpoint } from "@enums/ApiEndpoints";
import { SitesLink } from "@enums/PageLinks";
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

const LoginForm = () => {
	const [disableLoginForm, setDisableLoginForm] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);
	const router = useRouter();

	React.useEffect(() => {
		setErrorMsg([]);
		setSuccessMsg([]);
	}, []);

	const { t } = useTranslation("login");
	const username = t("username");
	const password = t("password");
	const requiredField = t("requiredField");
	const loginSuccess = t("loginSuccess");
	const loginFailed = t("loginFailed");
	const showPassword = t("showPassword");
	const hidePassword = t("hidePassword");
	const rememberMe = t("rememberMe");
	const forgotPassword = t("forgotPassword");
	const signingIn = t("signingIn");
	const signIn = t("signIn");
	const continueWith = t("continueWith");

	const linksArray = SocialLoginLinks();

	return (
		<React.Fragment>
			{errorMsg && Array.isArray(errorMsg) && errorMsg !== [] && errorMsg.length > 0 ? (
				errorMsg.map((value, key) => <ErrorMessageAlert key={key} message={value} />)
			) : typeof errorMsg === "string" && errorMsg !== "" && errorMsg.length > 0 ? (
				<ErrorMessageAlert message={errorMsg} />
			) : null}

			{successMsg && Array.isArray(successMsg) && successMsg !== [] && successMsg.length > 0 ? (
				successMsg.map((value, key) => <SuccessMessageAlert key={key} message={value} />)
			) : typeof successMsg === "string" && successMsg !== "" && successMsg.length > 0 ? (
				<SuccessMessageAlert message={successMsg} />
			) : null}

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
					const data = response?.data || null;
					const status = response?.status || null;

					Math.floor(status / 200) === 1
						? (() => {
								setSubmitting(false);
								setDisableLoginForm(!disableLoginForm);

								data
									? (() => {
											setSuccessMsg((successMsg) => [...successMsg, loginSuccess]);

											setTimeout(() => {
												router.push(SitesLink);
											}, RedirectInterval);
									  })()
									: (() => {
											resetForm({ values: "" });
											setSubmitting(false);
											setErrorMsg(loginFailed);
									  })();
						  })()
						: (() => {
								data
									? (() => {
											resetForm({ values: "" });
											setSubmitting(false);

											data?.non_field_errors?.map((message) => {
												setErrorMsg((errorMsg) => [...errorMsg, message]);
											});
									  })()
									: (() => {
											resetForm({ values: "" });
											setSubmitting(false);
											setErrorMsg(loginFailed);
									  })();
						  })();
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
											errors.username || errorMsg.length ? tw`border-red-300` : tw`border-gray-300`
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
											errors.password || errorMsg.length ? tw`border-red-300` : tw`border-gray-300`
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

							<div tw="mt-6 grid grid-cols-3 gap-3">
								{linksArray.map((links, key) => {
									return (
										<div key={key}>
											<span tw="w-full inline-flex rounded-md shadow-sm">
												<a
													href={links.href}
													disabled={links.disabled}
													title={links.label}
													css={[
														tw`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500`,
														links.disabled
															? tw`bg-gray-300 opacity-50 cursor-not-allowed pointer-events-none`
															: tw`bg-white`,
														isSubmitting || disableLoginForm
															? tw`bg-gray-300 cursor-not-allowed pointer-events-none`
															: tw`hover:bg-gray-50`
													]}
												>
													<span tw="sr-only">{links.label}</span>
													<FontAwesomeIcon icon={links.icon} tw="w-4 h-4" />
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
	errorMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func
};

export default LoginForm;
