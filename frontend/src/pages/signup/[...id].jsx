import 'core-js';
import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Head from 'next/head';
import { Formik } from 'formik';
import Cookies from 'js-cookie';
import PasswordStrengthBar from 'react-password-strength-bar';
import styled from 'styled-components';
import * as Yup from 'yup';
import Layout from 'components/Layout';
import LogoLabel from 'components/form/LogoLabel';
import SignupLabel from 'public/label/pages/signup.json';

const SignupFormDiv = styled.div``;

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const SignupForm = (props) => {
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [disableForm, setDisableForm] = useState(false);

	const pageTitle = 'Add Password Form | Site Crawler';
	const signupConfirmApiEndpoint =
		'/api/signup/' + props.result.id[0] + '/confirm/';
	const sitesDashboardApiEndpoint = '/dashboard/sites';

	return (
		<Layout>
			<Head>
				<title>{pageTitle}</title>
			</Head>

			<SignupFormDiv className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
				<LogoLabel isAddPassword />

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

					{!disableForm ? (
						<div className="bg-white py-8 px-4 shadow-xs rounded-lg sm:px-10">
							<Formik
								initialValues={{
									password: '',
									repeatPassword: ''
								}}
								validationSchema={Yup.object().shape({
									password: Yup.string().required(SignupLabel[0].label),
									repeatPassword: Yup.string()
										.when('password', {
											is: (val) => (val && val.length > 0 ? true : false),
											then: Yup.string().oneOf(
												[Yup.ref('password')],
												SignupLabel[3].label
											)
										})
										.required(SignupLabel[0].label)
								})}
								onSubmit={async (values, { setSubmitting, resetForm }) => {
									const body = {
										password: values.password
									};

									await sleep(500);
									await axios
										.post(signupConfirmApiEndpoint, body, {
											headers: {
												'Accept': 'application/json',
												'Content-Type': 'application/json',
												'X-CSRFToken': Cookies.get('csrftoken')
											}
										})
										.then((response) => {
											// Debugging purpose only
											// console.log(response.data);
											// console.log(response.status);
											// console.log(response.statusText);
											// console.log(response.headers);
											// console.log(response.config);

											setSubmitting(false);
											resetForm({ values: '' });
											setDisableForm(!disableForm);
											setSuccessMsg(SignupLabel[4].label);

											setTimeout(async () => {
												Router.push(sitesDashboardApiEndpoint);
											}, 1500);
										})
										.catch((error) => {
											if (error.response) {
												// Debugging purpose only
												console.log('Error', error.response.data);
												console.log('Error', error.response.status);
												console.log('Error', error.response.headers);
											} else if (error.request) {
												// Debugging purpose only
												console.log('Error', error.request);
											} else {
												// Debugging purpose only
												console.log('Error', error.message);
											}

											// Debugging purpose only
											console.log('Error', error.config);

											setSubmitting(false);
											resetForm({ values: '' });
											setErrorMsg(SignupLabel[5].label);
										});
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
									<form
										className="px-4 py-5 bg-white sm:p-6"
										onSubmit={handleSubmit}
									>
										<div className="mt-1">
											<label
												htmlFor="firstname"
												className="block text-sm font-medium leading-5 text-gray-700"
											>
												{SignupLabel[6].label}
											</label>
											<div className="mt-1 rounded-md shadow-xs-sm">
												<input
													id="password"
													type="password"
													name="password"
													className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
														errors.password
															? 'border-red-300'
															: 'border-gray-300'
													}`}
													aria-describedby="password"
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.password}
												/>
												<PasswordStrengthBar password={values.password} />
											</div>
											{errors.password && touched.password && (
												<span className="block mt-2 text-sm leading-5 text-red-700">
													{errors.password &&
														touched.password &&
														errors.password}
												</span>
											)}
										</div>

										<div className="mt-6">
											<label
												htmlFor="lastname"
												className="block text-sm font-medium leading-5 text-gray-700"
											>
												{SignupLabel[7].label}
											</label>
											<div className="mt-1 rounded-md shadow-xs-sm">
												<input
													id="repeatPassword"
													type="password"
													name="repeatPassword"
													className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
														errors.repeatPassword
															? 'border-red-300'
															: 'border-gray-300'
													}`}
													aria-describedby="repeatPassword"
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.repeatPassword}
												/>
											</div>
											{errors.repeatPassword && touched.repeatPassword && (
												<span className="block mt-2 text-sm leading-5 text-red-700">
													{errors.repeatPassword &&
														touched.repeatPassword &&
														errors.repeatPassword}
												</span>
											)}
										</div>

										<div className="mt-6">
											<span className="block w-full rounded-md shadow-xs-sm">
												<button
													type="submit"
													className="w-full flex justify-center mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
													disabled={isSubmitting}
												>
													{SignupLabel[8].label}
												</button>
											</span>
										</div>
									</form>
								)}
							</Formik>
						</div>
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
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
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
			</SignupFormDiv>
		</Layout>
	);
};

export async function getServerSideProps(context) {
	return {
		props: {
			result: context.query
		}
	};
}

export default SignupForm;
