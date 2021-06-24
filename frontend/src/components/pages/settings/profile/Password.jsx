// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import loadable from "@loadable/component";
import PasswordStrengthBar from "react-password-strength-bar";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import PasswordLabel from "public/labels/components/profile/Password.json";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const SettingsPassword = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [disableForm, setDisableForm] = React.useState(true);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [hasPasswordError, setHasPasswordError] = React.useState(false);
	const [passwordError, setPasswordError] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	const passwordChangeApiEndpoint = "/api/auth/password/change/";

	React.useEffect(() => {
		props.user !== undefined
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.user]);

	return (
		<div>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={PasswordLabel[12].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={PasswordLabel[13].label}
			/>

			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{PasswordLabel[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{PasswordLabel[0].description}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<Formik
					initialValues={{
						password1: "",
						password2: ""
					}}
					validationSchema={Yup.object().shape({
						password1: Yup.string()
							.min(10, PasswordLabel[7].label)
							.max(128, PasswordLabel[8].label)
							.required(PasswordLabel[6].label),
						password2: Yup.string()
							.when("password1", {
								is: (val) => val && val.length > 0,
								then: Yup.string().oneOf([Yup.ref("password1")], PasswordLabel[9].label)
							})
							.required(PasswordLabel[6].label)
					})}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						const body = {
							new_password1: values.password1,
							new_password2: values.password2
						};

						const response = await axios
							.post(passwordChangeApiEndpoint, body)
							.then((response) => {
								return response;
							})
							.catch((error) => {
								return error.response;
							});
						const data = await response.data;

						Math.floor(response.status / 200) === 1
							? (() => {
									resetForm({ values: "" });

									data
										? (() => {
												setTimeout(() => {
													setSubmitting(false);
												}, 1000);

												setHasPasswordError(false);
												setDisableForm(true);
												setSuccessMsg(PasswordLabel[14].label);
												setSuccessMsgLoaded(true);
										  })()
										: null;
							  })()
							: data
							? data?.detail
								? (() => {
										setTimeout(() => {
											setSubmitting(false);
										}, 1000);

										setHasPasswordError(true);
										setDisableForm(false);
										setPasswordError(data?.detail);
										setErrorMsgLoaded(!errorMsgLoaded);
								  })()
								: null
							: null;
					}}
				>
					{({ values, errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
						<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
							<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
											<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
												{PasswordLabel[1].label}
											</label>
											<div tw="mt-1 relative flex rounded-md shadow-sm">
												<input
													type="password"
													id="password1"
													value={values.password1}
													name="password1"
													disabled={
														isSubmitting ? isSubmitting : disableForm && hasPasswordError ? !disableForm : disableForm
													}
													css={[
														tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
														(isSubmitting
															? isSubmitting
															: disableForm && hasPasswordError
															? !disableForm
															: disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
														errors.password1 ? tw`border-red-300` : tw`border-gray-300`
													]}
													aria-describedby="password1"
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>
											<PasswordStrengthBar className="w-full" password={values.password1} />
										</>
									) : (
										<>
											<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
											<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
										</>
									)}

									{errors.password1 && touched.password1 && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password1 && errors.password1}</span>
									)}
								</div>

								<div tw="sm:col-span-3">
									{componentReady ? (
										<>
											<label htmlFor="password2" tw="block text-sm font-medium leading-5 text-gray-700">
												{PasswordLabel[2].label}
											</label>
											<div tw="mt-1 relative flex rounded-md shadow-sm">
												<input
													type="password"
													id="password2"
													value={values.password2}
													name="password2"
													disabled={
														isSubmitting ? isSubmitting : disableForm && hasPasswordError ? !disableForm : disableForm
													}
													css={[
														tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
														(isSubmitting
															? isSubmitting
															: disableForm && hasPasswordError
															? !disableForm
															: disableForm) && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
														errors.password2 ? tw`border-red-300` : tw`border-gray-300`
													]}
													aria-describedby="password2"
													onChange={handleChange}
													onBlur={handleBlur}
												/>
											</div>
										</>
									) : (
										<>
											<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
											<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
										</>
									)}

									{errors.password2 && touched.password2 && (
										<span tw="block mt-2 text-xs leading-5 text-red-700">{errors.password2 && errors.password2}</span>
									)}
								</div>

								<div tw="sm:col-span-3">
									<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
										<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
											<span tw="inline-flex">
												{componentReady ? (
													!disableForm ? (
														<button
															type="submit"
															disabled={isSubmitting || Object.keys(errors).length > 0}
															css={[
																tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
																isSubmitting || Object.keys(errors).length > 0
																	? tw`opacity-50 cursor-not-allowed`
																	: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
															]}
														>
															{isSubmitting
																? PasswordLabel[11].label
																: !passwordError && !disableForm
																? PasswordLabel[5].label
																: disableForm && passwordError
																? PasswordLabel[5].label
																: PasswordLabel[3].label}
														</button>
													) : (
														<button
															type="button"
															disabled={isSubmitting || Object.keys(errors).length > 0}
															css={[
																tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
																isSubmitting || Object.keys(errors).length > 0
																	? tw`opacity-50 cursor-not-allowed`
																	: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
															]}
															onClick={() => setDisableForm(!disableForm)}
														>
															{isSubmitting
																? PasswordLabel[11].label
																: !passwordError && !disableForm
																? PasswordLabel[5].label
																: disableForm && passwordError
																? PasswordLabel[5].label
																: PasswordLabel[3].label}
														</button>
													)
												) : (
													<Skeleton
														duration={2}
														width={82.39}
														height={38}
														tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
													/>
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

SettingsPassword.propTypes = {};

export default SettingsPassword;
