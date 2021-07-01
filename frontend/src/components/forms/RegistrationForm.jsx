// React
import * as React from "react";

// External
import { Formik } from "formik";
import * as Sentry from "@sentry/nextjs";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import loadable from "@loadable/component";
import PasswordStrengthBar from "react-password-strength-bar";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Loadable
const ErrorMessageAlert = loadable(() => import("src/components/alerts/ErrorMessageAlert"));
const SuccessMessageAlert = loadable(() => import("src/components/alerts/SuccessMessageAlert"));

const RegistrationForm = (props) => {
	const [errorEmail, setErrorEmail] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [errorUsername, setErrorUsername] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const registrationApiEndpoint = "/api/auth/registration/";

	return (
		<div tw="bg-white mt-8 py-8 px-4 shadow-xl rounded-lg sm:px-10">
			{successMsg.length > 0
				? successMsg.map((value, index) => {
						return (
							<SuccessMessageAlert
								key={index}
								message={value}
								className={errorMsg.length > 1 && index > 0 ? "bottom-20" : "bottom-0"}
							/>
						);
				  })
				: null}

			{errorMsg.length > 0
				? errorMsg.map((value, index) => {
						return (
							<ErrorMessageAlert
								key={index}
								message={value}
								className={errorMsg.length > 1 && index > 0 ? "bottom-20" : "bottom-0"}
							/>
						);
				  })
				: null}

			<Formik
				initialValues={{
					firstname: "",
					lastname: "",
					username: "",
					email: "",
					password1: "",
					password2: ""
				}}
				validationSchema={Yup.object({
					firstname: Yup.string().required(props.label[0]),
					lastname: Yup.string().required(props.label[0]),
					username: Yup.string().required(props.label[0]),
					email: Yup.string().email(props.label[1]).required(props.label[0]),
					password1: Yup.string().min(8, props.label[4]).max(128, props.label[5]).required(props.label[0]),
					password2: Yup.string()
						.when("password1", {
							is: (val) => val && val.length > 0,
							then: Yup.string().oneOf([Yup.ref("password1")], props.label[6])
						})
						.required(props.label[0])
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						username: values.username,
						email: values.email,
						password1: values.password1,
						password2: values.password2,
						first_name: values.firstname,
						last_name: values.lastname
					};

					setErrorMsg([]);
					setSuccessMsg([]);
					setErrorUsername(false);
					setErrorEmail(false);

					return await axios
						.post(registrationApiEndpoint, body, {
							headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
								"X-CSRFToken": Cookies.get("csrftoken")
							}
						})
						.then((response) => {
							Math.floor(response.status / 200) === 1
								? (() => {
										setSubmitting(false);
										resetForm({ values: "" });
										setSuccessMsg((successMsg) => [...successMsg, props.label[8]]);
								  })()
								: (() => {
										Sentry.captureException(response);

										setSubmitting(false);
										resetForm({ values: "" });
										setErrorMsg((errorMsg) => [...errorMsg, props.label[9]]);
								  })();
						})
						.catch((error) => {
							error.response.data
								? (() => {
										error.response.data.username
											? (() => {
													Sentry.captureException(error.response.data.username);

													setSubmitting(false);
													setErrorMsg((errorMsg) => [...errorMsg, error.response.data.username]);
													setErrorUsername(true);
											  })()
											: null;

										error.response.data.email
											? (() => {
													Sentry.captureException(error.response.data.email);

													setSubmitting(false);
													setErrorMsg((errorMsg) => [...errorMsg, error.response.data.email]);
													setErrorEmail(true);
											  })()
											: null;
								  })()
								: (() => {
										Sentry.captureException(error.message);

										setSubmitting(false);
										resetForm({ values: "" });
										setErrorMsg((errorMsg) => [...errorMsg, props.label[9]]);
								  })();
						});
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="firstname" tw="block text-sm font-medium text-gray-700">
								{props.label[10]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="firstname"
									type="text"
									name="firstname"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.firstname ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="firstname"
									onChange={handleChange}
									value={values.firstname}
								/>
							</div>

							{errors.firstname && touched.firstname && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.firstname && touched.firstname && errors.firstname}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<label htmlFor="lastname" tw="block text-sm font-medium text-gray-700">
								{props.label[11]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="lastname"
									type="text"
									name="lastname"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.lastname ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="lastname"
									onChange={handleChange}
									value={values.lastname}
								/>
							</div>

							{errors.lastname && touched.lastname && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.lastname && touched.lastname && errors.lastname}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<label htmlFor="username" tw="block text-sm font-medium text-gray-700">
								{props.label[12]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="username"
									type="text"
									name="username"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.username || errorUsername ? tw`border-red-300` : tw`border-gray-300`
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
							<label htmlFor="email" tw="block text-sm font-medium text-gray-700">
								{props.label[13]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="email"
									type="email"
									name="email"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none `,
										errors.email || errorEmail ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="email"
									onChange={handleChange}
									value={values.email}
								/>
							</div>

							{errors.email && touched.email && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.email && touched.email && errors.email}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
								{props.label[14]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="password1"
									type="password"
									name="password1"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.password1 ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password1"
									onChange={handleChange}
									value={values.password1}
								/>
							</div>
							<PasswordStrengthBar password={values.password1} />

							{errors.password1 && touched.password1 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password1 && touched.password1 && errors.password1}
								</span>
							)}
						</div>

						<div tw="mt-6">
							<label htmlFor="password" tw="block text-sm font-medium text-gray-700">
								{props.label[2]}
							</label>
							<div tw="mt-1 rounded-md">
								<input
									id="password2"
									type="password"
									name="password2"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md sm:leading-5`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.password2 ? tw`border-red-300` : tw`border-gray-300`
									]}
									aria-describedby="password2"
									onChange={handleChange}
									value={values.password2}
								/>
							</div>

							{errors.password2 && touched.password2 && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">
									{errors.password2 && touched.password2 && errors.password2}
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
									{isSubmitting ? props.label[7] : props.label[3]}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

RegistrationForm.propTypes = {};

export default RegistrationForm;
