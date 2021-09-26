import { GoogleLoginApiEndpoint, LoginApiEndpoint } from "@enums/ApiEndpoints";
import { LoginLabels } from "@enums/LoginLabels";
import { SitesLink } from "@enums/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePostMethod } from "@hooks/useHttpMethod";
import { useShowPassword } from "@hooks/useShowPassword";
import { Formik } from "formik";
import Link from "next/link";
import Router from "next/router";
import PropTypes from "prop-types";
import * as React from "react";
import tw from "twin.macro";
import * as Yup from "yup";

const LoginForm = ({ errorMsg, setErrorMsg, setSuccessMsg }) => {
	const [disableLoginForm, setDisableLoginForm] = React.useState(false);

	const { passwordRef, isPasswordShown, setIsPasswordShown } = useShowPassword(false);

	return (
		<Formik
			initialValues={{
				username: "",
				password: "",
				rememberme: false
			}}
			validationSchema={Yup.object({
				username: Yup.string().required(LoginLabels[10].label),
				password: Yup.string().required(LoginLabels[10].label)
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

				try {
					const response = await usePostMethod(LoginApiEndpoint, body);
					const data = response.data;

					setErrorMsg([]);
					setSuccessMsg([]);

					if (Math.floor(response.status / 200) === 1) {
						setSubmitting(false);
						setDisableLoginForm(!disableLoginForm);

						if (data.key && data.key !== undefined && data.key.length > 0) {
							setSuccessMsg((successMsg) => [...successMsg, LoginLabels[12].label]);

							setTimeout(() => {
								Router.push(SitesLink);
							}, 500);
						}
					} else {
						if (data) {
							setSubmitting(false);
							setErrorMsg((errorMsg) => [...errorMsg, data.non_field_errors]);
						} else {
							resetForm({ values: "" });
							setSubmitting(false);
							setErrorMsg(LoginLabels[11].label);
						}
					}
				} catch (error) {
					return null;
				}
			}}
		>
			{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
				<>
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="username" tw="block text-sm font-medium text-gray-700">
								{LoginLabels[2].label}
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
									{LoginLabels[3].label}
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
										{isPasswordShown ? LoginLabels[15].label : LoginLabels[14].label}
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
									{LoginLabels[4].label}
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
										{LoginLabels[5].label}
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
									{isSubmitting || disableLoginForm ? LoginLabels[13].label : LoginLabels[6].label}
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
								<span tw="px-2 bg-white text-gray-600">{LoginLabels[7].label}</span>
							</div>
						</div>

						<div tw="mt-6 grid grid-cols-3 gap-3">
							<div>
								<span tw="w-full inline-flex rounded-md shadow-sm">
									<a
										href={GoogleLoginApiEndpoint}
										css={[
											tw`w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500`,
											isSubmitting || disableLoginForm
												? tw`bg-gray-300 cursor-not-allowed pointer-events-none`
												: tw`hover:bg-gray-50`
										]}
									>
										<span tw="sr-only">{LoginLabels[16].label}</span>
										<FontAwesomeIcon icon={["fab", "google"]} tw="w-4 h-4" />
									</a>
								</span>
							</div>

							<div>
								<span tw="w-full inline-flex rounded-md shadow-sm">
									<a
										href="#"
										disabled={true}
										tw="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none"
									>
										<span tw="sr-only">{LoginLabels[17].label}</span>
										<FontAwesomeIcon icon={["fab", "facebook-f"]} tw="w-4 h-4" />
									</a>
								</span>
							</div>

							<div>
								<span tw="w-full inline-flex rounded-md shadow-sm">
									<a
										href="#"
										disabled={true}
										tw="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none"
									>
										<span tw="sr-only">{LoginLabels[18].label}</span>
										<FontAwesomeIcon icon={["fab", "linkedin-in"]} tw="w-4 h-4" />
									</a>
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

LoginForm.propTypes = {
	errorMsg: PropTypes.array,
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func
};

export default LoginForm;
