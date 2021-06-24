// React
import { useState } from "react";

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

const ResetPassword = () => {
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const pageTitle = "Reset Password";
	const loginLink = "/login/";
	const resetPasswordApiEndpoint = "/api/auth/password/reset/";

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
								email: ""
							}}
							validationSchema={Yup.object({
								email: Yup.string().email(ResetPasswordLabel[1].label).required(ResetPasswordLabel[0].label)
							})}
							onSubmit={async (values, { setSubmitting, resetForm }) => {
								const body = {
									email: values.email
								};

								try {
									const response = await usePostMethod(resetPasswordApiEndpoint, body);

									if (Math.floor(response.status / 200) === 1) {
										setErrorMsg("");
										setSubmitting(false);
										resetForm({ values: "" });
										setSuccessMsg(response.data.detail);
									} else {
										if (response.data) {
											setSuccessMsg("");

											console.log(response.data);
										} else {
											setSubmitting(false);
											resetForm({ values: "" });
											setErrorMsg(ResetPasswordLabel[3].label);
										}
									}
								} catch (error) {
									// FIXME: add logging solution here
									return null;
								}
							}}
						>
							{({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
								<form onSubmit={handleSubmit}>
									<div tw="mt-1">
										<label htmlFor="email" tw="block text-sm font-medium leading-5 text-gray-700">
											{ResetPasswordLabel[4].label}
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
							<Link href={loginLink}>
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

ResetPassword.propTypes = {};

export default ResetPassword;
