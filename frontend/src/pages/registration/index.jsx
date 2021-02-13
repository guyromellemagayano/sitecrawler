// React
import React, { Fragment, useState } from 'react';

// NextJS
import Link from 'next/link';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import * as Yup from 'yup';
import PasswordStrengthBar from 'react-password-strength-bar';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// JSON
import RegistrationLabel from 'public/label/pages/registration.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import Layout from 'src/components/Layout';
import LogoLabel from 'src/components/form/LogoLabel';

const RegistrationDiv = styled.div``;

const Registration = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorFirstnameMsg, setErrorFirstnameMsg] = useState('');
	const [errorLastnameMsg, setErrorLastnameMsg] = useState('');
	const [errorUsernameMsg, setErrorUsernameMsg] = useState('');
	const [errorEmailMsg, setErrorEmailMsg] = useState('');
	const [errorPassword1Msg, setErrorPassword1Msg] = useState('');
	const [errorPassword2Msg, setErrorPassword2Msg] = useState('');
	const [disableRegistrationForm, setDisableRegistrationForm] = useState(false);

	const pageTitle = 'Registration';
	const registrationApiEndpoint = '/api/auth/registration/';

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<RegistrationDiv className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				{!disableRegistrationForm ? <LogoLabel isSignUp /> : null}

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

					{!disableRegistrationForm ? (
						<Fragment>
							<div className="bg-white py-8 px-4 shadow-xs rounded-lg sm:px-10">
								<Formik
									initialValues={{
										firstname: '',
										lastname: '',
										username: '',
										email: '',
										password1: '',
										password2: ''
									}}
									validationSchema={Yup.object({
										firstname: Yup.string().required(
											RegistrationLabel[0].label
										),
										lastname: Yup.string().required(RegistrationLabel[0].label),
										username: Yup.string().required(RegistrationLabel[0].label),
										email: Yup.string()
											.email(RegistrationLabel[1].label)
											.required(RegistrationLabel[0].label),
										password1: Yup.string()
											.min(10, RegistrationLabel[12].label)
											.max(128, RegistrationLabel[13].label)
											.required(RegistrationLabel[0].label),
										password2: Yup.string()
											.when('password1', {
												is: (val) => val && val.length > 0,
												then: Yup.string().oneOf(
													[Yup.ref('password1')],
													RegistrationLabel[14].label
												)
											})
											.required(RegistrationLabel[0].label)
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

										const response = await usePostMethod(
											registrationApiEndpoint,
											body
										);

										if (Math.floor(response.status / 200) === 1) {
											setSubmitting(false);
											setDisableRegistrationForm(!disableRegistrationForm);
											resetForm({ values: '' });
											setSuccessMsg(RegistrationLabel[2].label);
										} else {
											if (response.data) {
												if (response.data.first_name) {
													setErrorFirstnameMsg(response.data.first_name);
												}

												if (response.data.last_name) {
													setErrorLastnameMsg(response.data.last_name);
												}

												if (response.data.username) {
													setErrorUsernameMsg(response.data.username);
												}

												if (response.data.email) {
													setErrorEmailMsg(response.data.email);
												}

												if (response.data.password1) {
													setErrorPassword1Msg(response.data.password1);
												}

												if (response.data.password2) {
													setErrorPassword2Msg(response.data.password2);
												}

												if (
													!response.data.first_name &&
													!response.data.last_name &&
													!response.data.username &&
													!response.data.email &&
													!response.data.password1 &&
													!response.data.password2
												) {
													setErrorMsg(RegistrationLabel[3].label);
												}
											} else {
												setSubmitting(false);
												resetForm({ values: '' });
												setErrorMsg(RegistrationLabel[3].label);
											}
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
													htmlFor="firstname"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[5].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="firstname"
														type="text"
														name="firstname"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.firstname || errorFirstnameMsg || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="firstname"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.firstname}
													/>
												</div>
												{errors.firstname && touched.firstname && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.firstname &&
															touched.firstname &&
															errors.firstname}
													</span>
												)}
												{errorFirstnameMsg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorFirstnameMsg}
													</span>
												)}
											</div>

											<div className="mt-6">
												<label
													htmlFor="lastname"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[6].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="lastname"
														type="text"
														name="lastname"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.lastname || errorLastnameMsg || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="lastname"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.lastname}
													/>
												</div>
												{errors.lastname && touched.lastname && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.lastname &&
															touched.lastname &&
															errors.lastname}
													</span>
												)}
												{errorLastnameMsg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorLastnameMsg}
													</span>
												)}
											</div>

											<div className="mt-6">
												<label
													htmlFor="username"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[7].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="username"
														type="text"
														name="username"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.username || errorUsernameMsg || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="username"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.username}
													/>
												</div>
												{errors.username && touched.username && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.username &&
															touched.username &&
															errors.username}
													</span>
												)}
												{errorUsernameMsg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorUsernameMsg}
													</span>
												)}
											</div>

											<div className="mt-6">
												<label
													htmlFor="email"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[8].label}
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
															errors.email || errorEmailMsg || errorMsg
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
												{errorEmailMsg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorEmailMsg}
													</span>
												)}
											</div>

											<div className="mt-6">
												<label
													htmlFor="password"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[9].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="password1"
														type="password"
														name="password1"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.password1 || errorPassword1Msg || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="password1"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.password1}
													/>
													<PasswordStrengthBar password={values.password1} />
												</div>
												{errors.password1 && touched.password1 && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.password1 &&
															touched.password1 &&
															errors.password1}
													</span>
												)}
												{errorPassword1Msg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorFirstnameMsg}
													</span>
												)}
											</div>

											<div className="mt-6">
												<label
													htmlFor="password"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{RegistrationLabel[10].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="password2"
														type="password"
														name="password2"
														disabled={isSubmitting}
														className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															isSubmitting &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.password2 || errorPassword2Msg || errorMsg
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="password2"
														onChange={handleChange}
														onBlur={handleBlur}
														value={values.password2}
													/>
												</div>
												{errors.password2 && touched.password2 && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.password2 &&
															touched.password2 &&
															errors.password2}
													</span>
												)}
												{errorPassword2Msg && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorPassword2Msg}
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
															? RegistrationLabel[15].label
															: RegistrationLabel[11].label}
													</button>
												</span>
											</div>
										</form>
									)}
								</Formik>

								<div className="mt-6">
									<div className="relative">
										<div className="relative flex justify-center wrap flex-row text-sm leading-5">
											<span className="px-2 bg-white text-gray-500 text-center">
												By signing up, you agree to the&nbsp;
												<Link href="/service-terms">
													<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
														Terms of Service
													</a>
												</Link>
												&nbsp;and&nbsp;
												<Link href="/privacy-policy">
													<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
														Privacy Policy
													</a>
												</Link>
											</span>
										</div>
									</div>
								</div>
							</div>

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
						</Fragment>
					) : (
						<div className="relative flex justify-center wrap flex-row text-sm leading-5">
							<span className="px-2 text-gray-500">
								<Link href="/">
									<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
										Go to Login
									</a>
								</Link>
							</span>
						</div>
					)}
				</div>
			</RegistrationDiv>
		</Layout>
	);
};

Registration.propTypes = {};

export default Registration;
