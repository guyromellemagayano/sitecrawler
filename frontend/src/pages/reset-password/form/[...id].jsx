// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";
import PasswordStrengthBar from "react-password-strength-bar";

// JSON
import ResetPasswordLabel from "public/labels/pages/reset-password.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";

// Layout
import Layout from "src/components/Layout";

// Components
import LogoLabel from "src/components/labels/LogoLabel";

// Loadable
const ErrorMessageAlert = loadable(() => import("src/components/alerts/ErrorMessageAlert"));
const SuccessMessageAlert = loadable(() => import("src/components/alerts/SuccessMessageAlert"));

const ResetPasswordForm = ({ result }) => {
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [token, setToken] = useState("");
	const [uid, setUid] = useState("");

	const pageTitle = "Reset Password Form";
	const confirmResetPasswordApiEndpoint = "/api/auth/password/reset/confirm/";

	useEffect(() => {
		if (result && result.id !== "" && result.id !== undefined && Object.keys(result).length > 0) {
			setUid(result.id[0]);
			setToken(result.id[1]);
		}
	}, [result]);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<LogoLabel isResetPassword />

				<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					{errorMsg && <ErrorMessageAlert message={errorMsg} />}
					{successMsg && <SuccessMessageAlert message={successMsg} />}

					<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
						<Formik
							initialValues={{
								password1: "",
								password2: "",
								uid: uid,
								token: token
							}}
							validationSchema={Yup.object({
								password1: Yup.string().required(ResetPasswordLabel[0].label),
								password2: Yup.string()
									.when("password1", {
										is: (val) => val && val.length > 0,
										then: Yup.string().oneOf([Yup.ref("password1")], ResetPasswordLabel[11].label)
									})
									.required(ResetPasswordLabel[0].label)
							})}
							onSubmit={async (values, { setSubmitting, resetForm }) => {
								const body = {
									new_password1: values.password1,
									new_password2: values.password2,
									uid: uid,
									token: token
								};

								try {
									const response = await usePostMethod(confirmResetPasswordApiEndpoint, body);
									const data = response.data;

									if (Math.floor(response.status / 200) === 1) {
										setErrorMsg("");
										setSubmitting(false);
										resetForm({ values: "" });
										setSuccessMsg(data.detail);
									} else {
										if (data) {
											setSuccessMsg("");

											console.log(data);
										} else {
											setSubmitting(false);
											resetForm({ values: "" });
											setErrorMsg(ResetPasswordLabel[3].label);
										}
									}
								} catch (error) {
									// FIXME: add logging solution here
									setSubmitting(false);
									resetForm({ values: "" });
									setErrorMsg(ResetPasswordLabel[3].label);
								}
							}}
						>
							{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
								<form onSubmit={handleSubmit}>
									<div tw="mt-1">
										<label htmlFor="password1" tw="block text-sm font-medium leading-5 text-gray-700">
											{ResetPasswordLabel[12].label}
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
											{ResetPasswordLabel[13].label}
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
												{isSubmitting ? ResetPasswordLabel[6].label : ResetPasswordLabel[5].label}
											</button>
										</span>
									</div>
								</form>
							)}
						</Formik>
					</div>

					<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
						<span tw="px-2 py-5 text-gray-500">
							{ReactHtmlParser(ResetPasswordLabel[7].label)}
							<Link href="/sites">
								<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
									{ResetPasswordLabel[8].label}
								</a>
							</Link>
						</span>
					</div>
				</div>
			</div>
		</Layout>
	);
};

ResetPasswordForm.propTypes = {};

export default ResetPasswordForm;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}
