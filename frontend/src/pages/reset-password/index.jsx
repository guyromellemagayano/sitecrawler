// React
import React, { Fragment, useState } from 'react';

// NextJS
import Link from 'next/link';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// JSON
import ResetPasswordLabel from 'public/label/pages/reset-password.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import Layout from 'src/components/Layout';
import LogoLabel from 'src/components/form/LogoLabel';

const ResetPasswordDiv = styled.div``;

const ResetPassword = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableResetPasswordForm, setDisableResetPasswordForm] = useState(
		false
	);

	const pageTitle = 'Reset Password';
	const resetPasswordApiEndpoint = '/api/auth/password/reset/';

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<ResetPasswordDiv className="min-h-screen bg-gray-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				{!disableResetPasswordForm ? <LogoLabel isResetPassword /> : null}

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					{errorMsg && (
						<div className="rounded-md bg-red-100 p-4 mb-8">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-red-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm leading-5 font-medium text-red-800 break-words">
										{errorMsg}
									</h3>
								</div>
							</div>
						</div>
					)}

					{successMsg && (
						<div className="rounded-md bg-green-100 p-4 mb-8">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										class="h-5 w-5 text-green-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm leading-5 font-medium text-green-800 break-words">
										{successMsg}
									</h3>
								</div>
							</div>
						</div>
					)}

					{!disableResetPasswordForm ? (
						<Fragment>
							<div className="bg-white py-8 px-4 shadow-xs rounded-lg sm:px-10">
								<Formik
									initialValues={{
										email: ''
									}}
									validationSchema={Yup.object({
										email: Yup.string()
											.email(ResetPasswordLabel[1].label)
											.required(ResetPasswordLabel[0].label)
									})}
									onSubmit={async (values, { setSubmitting, resetForm }) => {
										const body = {
											email: values.email
										};

										const response = await usePostMethod(
											resetPasswordApiEndpoint,
											body
										);

										if (Math.floor(response.status / 200) === 1) {
											setSubmitting(false);
											setDisableResetPasswordForm(!disableResetPasswordForm);
											resetForm({ values: '' });
											setSuccessMsg(ResetPasswordLabel[2].label);
										} else {
											setSubmitting(false);
											resetForm({ values: '' });
											setErrorMsg(ResetPasswordLabel[3].label);
										}
									}}
								>
									{({
										values,
										errors,
										touched,
										handleChange,
										handleBlur,
										handleSubmit,
										isSubmitting
									}) => (
										<form onSubmit={handleSubmit}>
											<div className="mt-1">
												<label
													htmlFor="email"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{ResetPasswordLabel[4].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="email"
														type="email"
														name="email"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.email || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="email"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.email}
													/>
												</div>
												{errors.email && touched.email && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.email && touched.email && errors.email}
													</span>
												)}
											</div>

											<div className="mt-6">
												<span className="block w-full rounded-md shadow-xs-sm">
													<button
														type="submit"
														disabled={isSubmitting}
														className={`w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out ${
															isSubmitting
																? 'opacity-50 bg-indigo-300 cursor-not-allowed'
																: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700'
														}`}
													>
														{isSubmitting
															? ResetPasswordLabel[6].label
															: ResetPasswordLabel[5].label}
													</button>
												</span>
											</div>
										</form>
									)}
								</Formik>
							</div>

							<div className="relative flex justify-center wrap flex-row text-sm leading-5">
								<span className="px-2 py-5 text-gray-500">
									Not Sure? Go back to&nbsp;
									<Link href="/">
										<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
											Login
										</a>
									</Link>
								</span>
							</div>
						</Fragment>
					) : (
						<div className="relative flex justify-center wrap flex-row text-sm leading-5">
							<span className="px-2 py-5 text-gray-500">
								Already have an account?&nbsp;
								<Link href="/">
									<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
										Log In
									</a>
								</Link>
							</span>
						</div>
					)}
				</div>
			</ResetPasswordDiv>
		</Layout>
	);
};

ResetPassword.propTypes = {};

export default ResetPassword;
