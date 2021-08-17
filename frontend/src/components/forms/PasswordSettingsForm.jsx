// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PasswordStrengthBar from "react-password-strength-bar";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { PasswordChangeApiEndpoint, UserApiEndpoint } from "@enums/ApiEndpoints";
import { PasswordSettingsLabels } from "@enums/PasswordSettingsLabels";
import { usePostMethod } from "@hooks/useHttpMethod";

const PasswordSettingsForm = ({ componentReady, mutateUser, setErrorMsg, setSuccessMsg }) => {
	const [disableForm, setDisableForm] = React.useState(true);

	return (
		<Formik
			initialValues={{
				password1: "",
				password2: ""
			}}
			validationSchema={Yup.object().shape({
				password1: Yup.string()
					.min(10, PasswordSettingsLabels[7].label)
					.max(128, PasswordSettingsLabels[8].label)
					.required(PasswordSettingsLabels[6].label),
				password2: Yup.string()
					.when("password1", {
						is: (val) => val && val.length > 0,
						then: Yup.string().oneOf([Yup.ref("password1")], PasswordSettingsLabels[9].label)
					})
					.required(PasswordSettingsLabels[6].label)
			})}
			onSubmit={async (values, { setSubmitting, resetForm }) => {
				const body = {
					new_password1: values.password1,
					new_password2: values.password2
				};

				const response = await usePostMethod(PasswordChangeApiEndpoint, body);

				setErrorMsg([]);
				setSuccessMsg([]);

				Math.floor(response?.status / 200) === 1
					? (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setSuccessMsg((successMsg) => [...successMsg, PasswordSettingsLabels[12].label]);
					  })()
					: (() => {
							resetForm({ values: "" });
							setSubmitting(false);
							setDisableForm(!disableForm);
							setErrorMsg((errorMsg) => [...errorMsg, PasswordSettingsLabels[13].label]);
					  })();

				mutateUser(UserApiEndpoint);
			}}
		>
			{({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
										{PasswordSettingsLabels[1].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="password"
											id="password1"
											value={values.password1}
											autoFocus={true}
											autoComplete="current-password"
											name="password1"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
												errors.password1 ? tw`border-red-300` : tw`border-gray-300`
											]}
											aria-describedby="password1"
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</div>
									<div css={[!disableForm ? tw`block` : tw`hidden`]}>
										<PasswordStrengthBar className="w-full" password={values.password1} />
									</div>
								</>
							) : (
								<>
									<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
									<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
								</>
							)}

							{errors.password1 && touched.password1 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password1 && touched.password1 && errors.password1}
								</span>
							)}
						</div>

						<div tw="sm:col-span-3">
							{componentReady ? (
								<>
									<label htmlFor="password2" tw="block text-sm font-medium leading-5 text-gray-700">
										{PasswordSettingsLabels[2].label}
									</label>
									<div tw="mt-1 relative flex rounded-md shadow-sm">
										<input
											type="password"
											id="password2"
											value={values.password2}
											name="password2"
											disabled={isSubmitting || disableForm}
											css={[
												tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
												(isSubmitting || disableForm) &&
													tw`opacity-50 bg-gray-300 cursor-not-allowed`,
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
									<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
								</>
							)}

							{errors.password2 && touched.password2 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password2 && touched.password2 && errors.password2}
								</span>
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
													disabled={
														isSubmitting ||
														Object.keys(errors).length > 0 ||
														(values.password1 === "" && values.password2 === "")
													}
													css={[
														tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
														isSubmitting ||
														Object.keys(errors).length > 0 ||
														(values.password1 === "" && values.password2 === "")
															? tw`opacity-50 cursor-not-allowed`
															: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
													]}
												>
													{isSubmitting
														? PasswordSettingsLabels[11].label
														: !disableForm
														? PasswordSettingsLabels[5].label
														: PasswordSettingsLabels[3].label}
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
														? PasswordSettingsLabels[11].label
														: !disableForm
														? PasswordSettingsLabels[5].label
														: PasswordSettingsLabels[3].label}
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
	);
};

PasswordSettingsForm.propTypes = {
	componentReady: PropTypes.bool,
	mutateUser: PropTypes.func,
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func
};

PasswordSettingsForm.defaultProps = {
	componentReady: false,
	mutateUser: null,
	setErrorMsg: null,
	setSuccessMsg: null
};

export default PasswordSettingsForm;
