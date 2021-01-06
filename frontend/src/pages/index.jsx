// React
import React, { useEffect, useState } from 'react';

// NextJS
import { useRouter } from 'next/router';
import Link from 'next/link';

// External

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

// JSON
import LoginLabel from 'public/label/pages/login.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';
import useUser from 'src/hooks/useUser';

// Components
import AppLogo from 'src/components/logo/AppLogo';
import Layout from 'src/components/Layout';
import LogoLabel from 'src/components/form/LogoLabel';
import SiteFooter from 'src/components/footer/SiteFooter';

const LoginDiv = styled.div``;

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const Login = () => {
	const [errorMsg, setErrorMsg] = useState(null);
	const [successMsg, setSuccessMsg] = useState(null);
	const [disableLoginForm, setDisableLoginForm] = useState(false);
	const [redirectTo, setRedirectTo] = useState('/dashboard/sites');

	const pageTitle = 'Login';
	const loginApiEndpoint = '/api/auth/login/';
	const googleLoginApiEndpoint = '/auth/google/login/';

	const { query } = useRouter();

	const { mutateUser } = useUser({
		redirectTo: redirectTo,
		redirectIfFound: true
	});

	useEffect(() => {
		if (Cookies.get('errLogin')) {
			setErrorMsg(Cookies.get('errLogin'));
			Cookies.remove('errLogin');
		}

		if (query.redirect !== undefined) setRedirectTo(query.redirect);
	}, []);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<LoginDiv className="bg-gray-300 min-h-screen">
				<div className="relative overflow-auto">
					<div className="relative pt-6 pb-12 md:pb-6">
						<main className="mt-8 sm:mt-16 md:mt-20 lg:mt-24">
							<div className="mx-auto max-w-screen-xl">
								<div className="lg:grid lg:grid-cols-12 lg:gap-8">
									<div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left lg:flex lg:items-center">
										<div>
											<AppLogo
												className="h-12 w-auto mx-auto mb-16 md:mx-auto lg:mx-0"
												src="/img/logos/site-logo-dark.svg"
												alt="app-logo"
											/>
											<h4 className="mt-4 text-4xl tracking-tight text-center lg:text-left leading-10 font-bold text-gray-900 sm:mt-5 sm:leading-none">
												{LoginLabel[0].label}
												<span className="text-red-600">
													{LoginLabel[1].label}
												</span>
												<br className="hidden md:inline" />
											</h4>
										</div>
									</div>
									<div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-5">
										<LogoLabel isLogin />

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

											{!disableLoginForm ? (
												<>
													<div className="bg-white py-8 px-4 rounded-lg sm:px-10 shadow-xl border border-gray-300">
														<Formik
															initialValues={{
																username: '',
																password: '',
																isRememberMeChecked: false
															}}
															validationSchema={Yup.object({
																username: Yup.string().required(
																	LoginLabel[10].label
																),
																password: Yup.string().required(
																	LoginLabel[10].label
																)
															})}
															onSubmit={async (
																values,
																{ setSubmitting, resetForm }
															) => {
																const body = {
																	username: values.username,
																	password: values.password
																};

																const response = await usePostMethod(
																	loginApiEndpoint,
																	'POST',
																	body
																);
																const data = await response.data;

																if (
																	response.statusText === 'OK' &&
																	response.status === 200
																) {
																	setDisableLoginForm(!disableLoginForm);
																	setSuccessMsg(LoginLabel[12].label);

																	setTimeout(async () => {
																		mutateUser(data);
																	}, 1500);
																} else {
																	setSubmitting(false);
																	resetForm({ values: '' });
																	setErrorMsg(LoginLabel[11].label);

																	const error = new Error(
																		await response.statusText
																	);

																	error.response = response;
																	error.data = data;

																	throw error;
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
																			htmlFor="username"
																			className="block text-sm font-medium leading-5 text-gray-700"
																		>
																			{LoginLabel[2].label}
																		</label>
																		<div className="mt-1 rounded-md shadow-xs-sm">
																			<input
																				id="username"
																				type="text"
																				name="username"
																				className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
																					errors.username
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
																			<span className="block mt-2 text-sm leading-5 text-red-700">
																				{errors.username &&
																					touched.username &&
																					errors.username}
																			</span>
																		)}
																	</div>

																	<div className="mt-6">
																		<label
																			htmlFor="password"
																			className="block text-sm font-medium leading-5 text-gray-700"
																		>
																			{LoginLabel[3].label}
																		</label>
																		<div className="mt-1 rounded-md shadow-xs-sm">
																			<input
																				id="password"
																				type="password"
																				name="password"
																				className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
																					errors.password
																						? 'border-red-300'
																						: 'border-gray-300'
																				}`}
																				aria-describedby="password"
																				onChange={handleChange}
																				onBlur={handleBlur}
																				value={values.password}
																			/>
																		</div>
																		{errors.password && touched.password && (
																			<span className="block mt-2 text-sm leading-5 text-red-700">
																				{errors.password &&
																					touched.password &&
																					errors.password}
																			</span>
																		)}
																	</div>

																	<div className="mt-6 flex items-center justify-between">
																		<div className="flex items-center">
																			<input
																				id="remember_me"
																				type="checkbox"
																				className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
																			/>
																			<label
																				htmlFor="remember_me"
																				className="ml-2 block text-sm leading-5 text-gray-900"
																			>
																				{LoginLabel[4].label}
																			</label>
																		</div>

																		<div className="text-sm leading-5">
																			<Link href="/reset-password">
																				<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																					{LoginLabel[5].label}
																				</a>
																			</Link>
																		</div>
																	</div>

																	<div className="mt-6">
																		<span className="block w-full rounded-md shadow-xs-sm">
																			<button
																				type="submit"
																				className="w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
																				disabled={isSubmitting}
																			>
																				{LoginLabel[6].label}
																			</button>
																		</span>
																	</div>
																</form>
															)}
														</Formik>

														<div className="mt-6">
															<div className="relative">
																<div className="absolute inset-0 flex items-center">
																	<div className="w-full border-t border-gray-300"></div>
																</div>
																<div className="relative flex justify-center text-sm leading-5">
																	<span className="px-2 bg-white text-gray-600">
																		{LoginLabel[7].label}
																	</span>
																</div>
															</div>

															<div className="mt-6 grid grid-cols-3 gap-3">
																<div>
																	<span className="w-full inline-flex rounded-md shadow-xs-sm">
																		<a
																			href={googleLoginApiEndpoint}
																			type="button"
																			className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition duration-150 ease-in-out"
																			aria-label="Sign in with Google"
																		>
																			<FontAwesomeIcon
																				icon={['fab', 'google']}
																				className="h-4"
																			/>
																		</a>
																	</span>
																</div>

																<div>
																	<span className="w-full inline-flex rounded-md shadow-xs-sm">
																		<Link href="#">
																			<a
																				type="button"
																				disabled="disabled"
																				className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 transition duration-150 ease-in-out opacity-50 cursor-not-allowed"
																				aria-label="Sign in with Facebook"
																			>
																				<FontAwesomeIcon
																					icon={['fab', 'facebook-f']}
																					className="h-4"
																				/>
																			</a>
																		</Link>
																	</span>
																</div>

																<div>
																	<span className="w-full inline-flex rounded-md shadow-xs-sm">
																		<Link href="#">
																			<a
																				type="button"
																				disabled="disabled"
																				className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-600 transition duration-150 ease-in-out opacity-50 cursor-not-allowed"
																				aria-label="Sign in with LinkedIn"
																			>
																				<FontAwesomeIcon
																					icon={['fab', 'linkedin-in']}
																					className="h-4"
																				/>
																			</a>
																		</Link>
																	</span>
																</div>
															</div>
														</div>
													</div>

													<div className="relative flex justify-center wrap flex-row text-sm leading-5">
														<span className="px-2 py-5 text-gray-600">
															{ReactHtmlParser(LoginLabel[8].label)}
															<Link href="/registration">
																<a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
																	{LoginLabel[9].label}
																</a>
															</Link>
														</span>
													</div>
												</>
											) : (
												successMsg && (
													<div className="rounded-md bg-green-100 p-4 mb-8">
														<div className="flex">
															<div className="flex-shrink-0">
																<svg
																	className="h-5 w-5 text-green-400"
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
																<h3 className="text-sm leading-5 font-medium text-green-800 break-words">
																	{successMsg}
																</h3>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								</div>

								<div className="px-4 xl:px-10 xl:mt-32">
									<SiteFooter />
								</div>
							</div>
						</main>
					</div>
				</div>
			</LoginDiv>
		</Layout>
	);
};

Login.propTypes = {
	errorMsg: PropTypes.string,
	successMsg: PropTypes.string,
	disableLoginForm: PropTypes.bool,
	redirectTo: PropTypes.func
};

export default Login;
