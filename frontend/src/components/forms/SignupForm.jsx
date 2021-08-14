// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// External
import { Formik } from "formik";
import * as Yup from "yup";
import PasswordStrengthBar from "react-password-strength-bar";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { FormSubmissionInterval } from "@enums/GlobalValues";
import { SignupApiEndpoint } from "@enums/ApiEndpoints";
import { SignupLabels } from "@enums/SignupLabels";
import { SitesLink } from "@enums/PageLinks";

// Hooks
import { usePostMethod } from "@hooks/useHttpMethod";

// Components
const ErrorMessageAlert = dynamic(() => import("@components/alerts/ErrorMessageAlert"));
const SuccessMessageAlert = dynamic(() => import("@components/alerts/SuccessMessageAlert"));

const SignupForm = ({ result }) => {
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const signupConfirmApiEndpoint = SignupApiEndpoint + result.id[0] + "/confirm/";

	const router = useRouter();

	return (
		<div>
			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

			<Formik
				initialValues={{
					password: "",
					repeatPassword: ""
				}}
				validationSchema={Yup.object().shape({
					password: Yup.string()
						.min(10, SignupLabels[10].label)
						.max(128, SignupLabels[11].label)
						.required(SignupLabels[0].label),
					repeatPassword: Yup.string()
						.when("password", {
							is: (val) => (val && val.length > 0 ? true : false),
							then: Yup.string().oneOf([Yup.ref("password")], SignupLabels[3].label)
						})
						.required(SignupLabels[0].label)
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						password: values.password
					};

					const response = await usePostMethod(signupConfirmApiEndpoint, body);

					Math.floor(response?.status / 200) === 1
						? (() => {
								resetForm({ values: "" });
								setSubmitting(false);
								setSuccessMsg((successMsg) => [...successMsg, SignupLabels[4].label]);

								setTimeout(() => {
									router.push(SitesLink);
								}, FormSubmissionInterval);
						  })()
						: (() => {
								resetForm({ values: "" });
								setSubmitting(false);
								setErrorMsg((errorMsg) => [...errorMsg, SignupLabels[5].label]);
						  })();
				}}
			>
				{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="password" tw="block text-sm font-medium leading-5 text-gray-700">
								{SignupLabels[6].label}
							</label>
							<div tw="mt-1">
								<input
									id="password"
									type="password"
									name="password"
									autoFocus={true}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										errors.password ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.password}
								/>
								<PasswordStrengthBar password={values.password} />
							</div>

							{errors.password && touched.password && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password && touched.password && errors.password}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<label
								htmlFor="repeatPassword"
								tw="block text-sm font-medium leading-5 text-gray-700"
							>
								{SignupLabels[7].label}
							</label>
							<div tw="mt-1">
								<input
									id="repeatPassword"
									type="password"
									name="repeatPassword"
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										errors.repeatPassword ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="repeatPassword"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.repeatPassword}
								/>
							</div>

							{errors.repeatPassword && touched.repeatPassword && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.repeatPassword && touched.repeatPassword && errors.repeatPassword}
								</span>
							)}
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
									{isSubmitting ? SignupLabels[9].label : SignupLabels[8].label}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

SignupForm.propTypes = {
	id: PropTypes.array
};

SignupForm.defaultProps = {
	id: null
};

export default SignupForm;
