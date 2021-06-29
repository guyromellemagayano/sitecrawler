// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

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

export const ResetPasswordForm = (props) => {
	const [errorMsg, setErrorMsg] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");

	const resetPasswordApiEndpoint = "/api/auth/password/reset/";

	return (
		<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
			{errorMsg && <ErrorMessageAlert message={errorMsg} />}
			{successMsg && <SuccessMessageAlert message={successMsg} />}

			<Formik
				initialValues={{
					email: ""
				}}
				validationSchema={Yup.object({
					email: Yup.string().email(props.label[0]).required(props.label[1])
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						email: values.email
					};

					await axios
						.post(resetPasswordApiEndpoint, body, {
							headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
								"X-CSRFToken": Cookies.get("csrftoken")
							}
						})
						.then((response) => {
							Math.floor(response.status / 200) === 1
								? (() => {
										setErrorMsg("");
										resetForm({ values: "" });
										setSubmitting(false);
										setSuccessMsg(response.data.detail);
								  })()
								: (() => {
										setSubmitting(false);
										resetForm({ values: "" });
										setErrorMsg(props.label[2]);
								  })();
						})
						.catch((error) => {
							Sentry.captureException(error);

							setSubmitting(false);
							resetForm({ values: "" });
							setErrorMsg(props.label[2]);
						});
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
								{props.label[3]}
							</label>
							<div tw="mt-1 rounded-md shadow-sm">
								<input
									id="email"
									type="email"
									name="email"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.email || errorMsg ? tw`border-red-300` : tw`border-gray-300`
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
									{isSubmitting ? props.label[4] : props.label[5]}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

ResetPasswordForm.propTypes = {};

export const UpdatePasswordForm = (props) => {
	const [errorMsg, setErrorMsg] = React.useState("");
	const [successMsg, setSuccessMsg] = React.useState("");
	const [token, setToken] = React.useState(null);
	const [uid, setUid] = React.useState(null);

	const confirmResetPasswordApiEndpoint = "/api/auth/password/reset/confirm/";
	const loginPage = "/login/";

	const router = useRouter();

	React.useEffect(() => {
		props.result.id
			? (() => {
					setUid(props.result.id[0]);
					setToken(props.result.id[1]);
			  })()
			: null;

		return { uid, token };
	}, [props.result]);

	return (
		<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
			{errorMsg && <ErrorMessageAlert message={errorMsg} />}
			{successMsg && <SuccessMessageAlert message={successMsg} />}

			<Formik
				initialValues={{
					password1: "",
					password2: "",
					uid: uid,
					token: token
				}}
				validationSchema={Yup.object({
					password1: Yup.string().required(props.label[0]),
					password2: Yup.string()
						.when("password1", {
							is: (val) => val && val.length > 0,
							then: Yup.string().oneOf([Yup.ref("password1")], props.label[1])
						})
						.required(props.label[0])
				})}
				onSubmit={async (values, { setSubmitting, resetForm }) => {
					const body = {
						new_password1: values.password1,
						new_password2: values.password2,
						uid: uid,
						token: token
					};

					await axios
						.post(confirmResetPasswordApiEndpoint, body, {
							headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
								"X-CSRFToken": Cookies.get("csrftoken")
							}
						})
						.then((response) => {
							Math.floor(response.status / 200) === 1
								? (() => {
										setErrorMsg("");
										resetForm({ values: "" });
										setSubmitting(false);
										setSuccessMsg(response.data.detail);

										setTimeout(() => {
											router.push(loginPage);
										}, 1000);
								  })()
								: (() => {
										setSubmitting(false);
										resetForm({ values: "" });
										setErrorMsg(props.label[2]);
								  })();
						})
						.catch((error) => {
							Sentry.captureException(error);

							setSubmitting(false);
							resetForm({ values: "" });
							setErrorMsg(props.label[2]);
						});
				}}
			>
				{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
					<form onSubmit={handleSubmit}>
						<div tw="mt-1">
							<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
								{props.label[3]}
							</label>
							<div tw="mt-1 rounded-md shadow-sm">
								<input
									id="password1"
									type="password"
									name="password1"
									disabled={isSubmitting}
									css={[
										tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
										isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
										errors.password1 || errorMsg ? tw`border-red-300` : tw`border-gray-300`
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
							<label htmlFor="password2" tw="block text-sm font-medium text-gray-700">
								{props.label[4]}
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
									{isSubmitting ? props.label[5] : props.label[6]}
								</button>
							</span>
						</div>
					</form>
				)}
			</Formik>
		</div>
	);
};

UpdatePasswordForm.propTypes = {};
