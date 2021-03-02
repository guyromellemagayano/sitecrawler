// React
import React, { useState, useEffect } from 'react';

// External
import 'core-js';
import { Formik } from 'formik';
import { Transition } from '@tailwindui/react';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import PasswordStrengthBar from 'react-password-strength-bar';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

// JSON
import PasswordLabel from 'public/label/components/profile/Password.json';

// Hooks
import useUser from 'src/hooks/useUser';

const ProfileSettingsPasswordDiv = styled.div``;

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const ProfileSettingsPassword = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [disablePasswordFields, setDisablePasswordFields] = useState(false);
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);

	const passwordChangeApiEndpoint = '/api/auth/password/change/';

	const handleEditPasswordProfile = (e) => {
		e.preventDefault();

		setDisablePasswordFields(!disablePasswordFields);
	};

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 2500);
	}, [showNotificationStatus]);

	return user ? (
		<>
			<ProfileSettingsPasswordDiv className="max-w-full bg-white shadow-xs rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<Formik
						initialValues={{
							password1: '',
							password2: ''
						}}
						validationSchema={Yup.object().shape({
							password1: Yup.string()
								.min(10, PasswordLabel[7].label)
								.max(128, PasswordLabel[8].label)
								.required(PasswordLabel[6].label),
							password2: Yup.string()
								.when('password1', {
									is: (val) => val && val.length > 0,
									then: Yup.string().oneOf(
										[Yup.ref('password1')],
										PasswordLabel[9].label
									)
								})
								.required(PasswordLabel[6].label)
						})}
						onSubmit={async (values, { setSubmitting, resetForm }) => {
							// Global axios defaults
							axios.defaults.headers.common['Accept'] = 'application/json';
							axios.defaults.headers.common['Content-Type'] =
								'application/x-www-form-urlencoded';
							axios.defaults.headers.common['X-CSRFToken'] = Cookies.get(
								'csrftoken'
							);

							const body = {
								new_password1: values.password1,
								new_password2: values.password2
							};

							try {
								const response = await axios.post(
									passwordChangeApiEndpoint,
									body
								);
								const data = await response.data;

								// Promise timeout
								await sleep(500);

								if (Math.floor(response.status / 200) === 1) {
									resetForm({ values: '' });

									if (data) {
										if (data.detail) {
											setPasswordError(false);
										}

										setSuccessMsg(PasswordLabel[10].label);
										setTimeout(() => setShowNotificationStatus(true), 1500);
										setDisablePasswordFields(!disablePasswordFields);
									}
								}
							} catch (error) {
								setSubmitting(false);
								resetForm({ values: '' });

								if (error.response) {
									if (error.response.data) {
										if (error.response.data.new_password2[0]) {
											setErrorMsg(error.response.data.new_password2[0]);
											setPasswordError(true);
										}
									}
								} else if (error.request) {
									setErrorMsg(
										'Error ' +
											error.request.status +
											' ' +
											error.request.statusText
									);
								} else {
									setErrorMsg(error.message);
								}
							}
						}}
					>
						{({
							values,
							errors,
							handleBlur,
							handleChange,
							handleSubmit,
							isSubmitting
						}) => (
							<form onSubmit={handleSubmit}>
								<div>
									<div>
										<div>
											<h3 className="text-lg leading-6 font-medium text-gray-900">
												{PasswordLabel[0].label}
											</h3>
											<p className="mt-1 text-sm leading-5 text-gray-500">
												{PasswordLabel[0].description}
											</p>
										</div>
										<div className="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
											<div className="sm:col-span-6">
												<label
													htmlFor="password1"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PasswordLabel[1].label}
												</label>
												<div className="mt-1 relative flex flex-row flex-wrap rounded-md shadow-sm">
													<input
														type="password"
														id="password1"
														value={values.password1}
														name="password1"
														disabled={!disablePasswordFields}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															!disablePasswordFields &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.password1 || passwordError
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="password1"
														onChange={handleChange}
														onBlur={handleBlur}
													/>
													{errors.password1 || passwordError ? (
														<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
															<svg
																className="h-5 w-5 text-red-500"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													) : null}
												</div>
												<PasswordStrengthBar
													className="w-full"
													password={values.password1}
												/>
												{errors.password1 && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.password1 && errors.password1}
													</span>
												)}
											</div>
										</div>
										<div className="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
											<div className="sm:col-span-6">
												<label
													htmlFor="password2"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PasswordLabel[2].label}
												</label>
												<div className="mt-1 relative flex rounded-md shadow-sm">
													<input
														type="password"
														id="password2"
														value={values.password2}
														name="password2"
														disabled={!disablePasswordFields}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															!disablePasswordFields &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.password2 || passwordError
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="password2"
														onChange={handleChange}
														onBlur={handleBlur}
													/>
													{errors.password2 || passwordError ? (
														<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
															<svg
																className="h-5 w-5 text-red-500"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													) : null}
												</div>
												{passwordError && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorMsg && errorMsg}
													</span>
												)}
												{errors.password2 && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.password2 && errors.password2}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className="mt-8 border-t border-gray-300 pt-5">
									<div className="flex justify-between xs:flex-col sm:flex-row md:flex-col lg:flex-row">
										<div className="flex justify-start xs:order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-auto">
											<span className="inline-flex sm:inline-block lg:inline-flex rounded-md shadow-sm sm:flex-1 lg:flex-none">
												<button
													type="submit"
													disabled={disablePasswordFields}
													className={`inline-flex xs:w-full lg:w-auto justify-center w-full rounded-md border border-gray-300 ml-3 xs:ml-0 xs:mt-3 lg:mt-0 sm:ml-0 px-4 py-2 text-sm leading-5 font-medium text-white bg-indigo-600 transition duration-150 ease-in-out ${
														disablePasswordFields
															? 'opacity-50 bg-indigo-300 cursor-not-allowed'
															: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700'
													}`}
													onClick={handleEditPasswordProfile}
												>
													{PasswordLabel[3].label}
												</button>
											</span>
											<span className="xs:w-full ml-3 xs:ml-0 xs:mt-3 lg:mt-0 lg:ml-3 inline-flex rounded-md shadow-sm">
												<button
													type="submit"
													disabled={!disablePasswordFields && !isSubmitting}
													className={`inline-flex xs:w-full justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
														!disablePasswordFields && !isSubmitting
															? 'opacity-50 bg-green-300 cursor-not-allowed'
															: 'hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700'
													}`}
												>
													{isSubmitting
														? PasswordLabel[11].label
														: PasswordLabel[5].label}
												</button>
											</span>
										</div>

										<Transition
											show={showNotificationStatus}
											className="flex lg:items-center justify-end xs:flex-col xs:order-2 sm:flex-row sm:flex-1 sm:grid sm:grid-cols-2 sm:gap-1 md:flex-col sm:w-full lg:order-2 lg:w-auto lg:flex lg:flex-row"
										>
											<div className="flex">
												<Transition.Child
													enter="transform ease-out duration-300 transition"
													enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
													enterTo="translate-y-0 opacity-100 sm:translate-x-0"
													leave="transition ease-in duration-100"
													leaveFrom="opacity-100"
													leaveTo="opacity-0"
													className="max-w-sm w-full"
												>
													<div className="flex">
														<div className="flex-shrink-0">
															<svg
																className="h-5 w-5 text-green-400"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fillRule="evenodd"
																	d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
														<div className="ml-2">
															<p className="text-sm leading-5 font-medium text-green-800">
																{successMsg}
															</p>
														</div>
													</div>
												</Transition.Child>
											</div>
										</Transition>
									</div>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</ProfileSettingsPasswordDiv>
		</>
	) : (
		<ProfileSettingsPasswordDiv className="mb-5 max-w-full">
			<Skeleton duration={2} width={320} height={586} />
		</ProfileSettingsPasswordDiv>
	);
};

ProfileSettingsPassword.propTypes = {};

export default ProfileSettingsPassword;
