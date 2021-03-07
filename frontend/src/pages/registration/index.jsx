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
import ReactHtmlParser from 'react-html-parser';
import tw from 'twin.macro';
// JSON
import RegistrationLabel from 'public/label/pages/registration.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import ErrorMessageAlert from 'src/components/alerts/ErrorMessageAlert';
import Layout from 'src/components/Layout';
import LogoLabel from 'src/components/form/LogoLabel';
import SiteFooter from 'src/components/footer/SiteFooter';
import SuccessMessageAlert from 'src/components/alerts/SuccessMessageAlert';

const Registration = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [errorFirstnameMsg, setErrorFirstnameMsg] = useState('');
	const [errorLastnameMsg, setErrorLastnameMsg] = useState('');
	const [errorUsernameMsg, setErrorUsernameMsg] = useState('');
	const [errorEmailMsg, setErrorEmailMsg] = useState('');
	const [errorPassword1Msg, setErrorPassword1Msg] = useState('');
	const [errorPassword2Msg, setErrorPassword2Msg] = useState('');

	const pageTitle = 'Registration';
	const registrationApiEndpoint = '/api/auth/registration/';

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-gray-50 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<LogoLabel isSignUp />

				<div tw="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					{errorMsg && <ErrorMessageAlert message={errorMsg} />}
					{successMsg && <SuccessMessageAlert message={successMsg} />}

					<div tw="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
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
								firstname: Yup.string().required(RegistrationLabel[0].label),
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

								try {
									const response = await usePostMethod(
										registrationApiEndpoint,
										body
									);

									if (Math.floor(response.status / 200) === 1) {
										setErrorMsg('');
										setSubmitting(false);
										resetForm({ values: '' });
										setSuccessMsg(RegistrationLabel[2].label);
									} else {
										if (response.data) {
											setSuccessMsg('');

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
												setSubmitting(false);
												setErrorMsg(RegistrationLabel[3].label);
											}
										} else {
											setSubmitting(false);
											resetForm({ values: '' });
											setErrorMsg(RegistrationLabel[3].label);
										}
									}
								} catch (error) {
									// FIXME: add logging solution here
									return null;
								}
							}}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								handleSubmit,
								isSubmitting
							}) => (
								<form onSubmit={handleSubmit}>
									<div tw="mt-1">
										<label
											htmlFor="firstname"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[5].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="firstname"
												type="text"
												name="firstname"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
													errors.firstname || errorFirstnameMsg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
												]}
												aria-describedby="firstname"
												onChange={handleChange}
												value={values.firstname}
											/>
										</div>

										{errors.firstname && touched.firstname && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errors.firstname &&
													touched.firstname &&
													errors.firstname}
											</span>
										)}
										{errorFirstnameMsg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorFirstnameMsg}
											</span>
										)}
									</div>

									<div tw="mt-6">
										<label
											htmlFor="lastname"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[6].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="lastname"
												type="text"
												name="lastname"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
													errors.lastname || errorLastnameMsg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
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
										{errorLastnameMsg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorLastnameMsg}
											</span>
										)}
									</div>

									<div tw="mt-6">
										<label
											htmlFor="username"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[7].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="username"
												type="text"
												name="username"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
													errors.username || errorUsernameMsg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
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
										{errorUsernameMsg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorUsernameMsg}
											</span>
										)}
									</div>

									<div tw="mt-6">
										<label
											htmlFor="email"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[8].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="email"
												type="email"
												name="email"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none pointer-events-none`,
													errors.email || errorEmailMsg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
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
										{errorEmailMsg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorEmailMsg}
											</span>
										)}
									</div>

									<div tw="mt-6">
										<label
											htmlFor="password"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[9].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="password1"
												type="password"
												name="password1"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
													errors.password1 || errorPassword1Msg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
												]}
												aria-describedby="password1"
												onChange={handleChange}
												value={values.password1}
											/>
										</div>
										<PasswordStrengthBar password={values.password1} />

										{errors.password1 && touched.password1 && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errors.password1 &&
													touched.password1 &&
													errors.password1}
											</span>
										)}
										{errorPassword1Msg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorFirstnameMsg}
											</span>
										)}
									</div>

									<div tw="mt-6">
										<label
											htmlFor="password"
											tw="block text-sm font-medium text-gray-700"
										>
											{RegistrationLabel[10].label}
										</label>
										<div tw="mt-1 rounded-md">
											<input
												id="password2"
												type="password"
												name="password2"
												disabled={isSubmitting}
												css={[
													tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md sm:text-sm sm:leading-5`,
													isSubmitting &&
														tw`opacity-50 bg-gray-300 cursor-not-allowed pointer-events-none`,
													errors.password2 || errorPassword2Msg || errorMsg
														? tw`border-red-300`
														: tw`border-gray-300`
												]}
												aria-describedby="password2"
												onChange={handleChange}
												value={values.password2}
											/>
										</div>

										{errors.password2 && touched.password2 && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errors.password2 &&
													touched.password2 &&
													errors.password2}
											</span>
										)}
										{errorPassword2Msg && (
											<span tw="block mt-2 text-xs leading-5 text-red-700">
												{errorPassword2Msg}
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
												{isSubmitting
													? RegistrationLabel[15].label
													: RegistrationLabel[11].label}
											</button>
										</span>
									</div>
								</form>
							)}
						</Formik>

						<div tw="mt-6">
							<div tw="relative">
								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="px-2 bg-white text-gray-500 text-center">
										{ReactHtmlParser(RegistrationLabel[16].label)}
										<Link href="/service-terms">
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabel[17].label}
											</a>
										</Link>
										&nbsp;and&nbsp;
										<Link href="/privacy-policy">
											<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
												{RegistrationLabel[18].label}
											</a>
										</Link>
									</span>
								</div>
							</div>
						</div>
					</div>

					<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
						<span tw="px-2 py-5 text-gray-500">
							{ReactHtmlParser(RegistrationLabel[19].label)}
							<Link href="/">
								<a tw="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
									{RegistrationLabel[20].label}
								</a>
							</Link>
						</span>
					</div>
				</div>
			</div>
		</Layout>
	);
};

Registration.propTypes = {};

export default Registration;
