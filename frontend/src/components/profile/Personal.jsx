// React
import React, { useState, useEffect } from 'react';

// External
import 'core-js';
import { Formik } from 'formik';
import { Transition } from '@tailwindui/react';
import * as Yup from 'yup';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

// JSON
import PersonalLabel from 'public/label/components/profile/Personal.json';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

const ProfileSettingsPersonalDiv = styled.div``;

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const ProfileSettingsPersonal = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [username, setUsername] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [usernameError, setUsernameError] = useState(false);
	const [disableInputFields, setDisableInputFields] = useState(false);
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);

	const userApiEndpoint = '/api/auth/user/';

	const { data: profile } = useSWR(userApiEndpoint, useFetcher);

	useEffect(() => {
		if (profile !== '' && profile !== undefined) {
			setUsername(profile.username);
			setFirstname(profile.first_name);
			setLastname(profile.last_name);
			setEmail(profile.email);
		}
	}, [profile]);

	const handleEditProfile = (e) => {
		e.preventDefault();

		setDisableInputFields(!disableInputFields);
	};

	const handleUserNameInputChange = (e) => {
		setUsername(e.target.value);
	};

	const handleFirstNameInputChange = (e) => {
		setFirstname(e.target.value);
	};

	const handleLastNameInputChange = (e) => {
		setLastname(e.target.value);
	};

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 2500);
	}, [showNotificationStatus]);

	return profile ? (
		<>
			<ProfileSettingsPersonalDiv className="mb-5 max-w-full bg-white shadow-xs rounded-lg">
				<div className="px-4 py-5 sm:p-6">
					<Formik
						enableReinitialize={true}
						initialValues={{
							username: username,
							firstname: firstname,
							lastname: lastname
						}}
						validationSchema={Yup.object().shape({
							username: Yup.string()
								.min(3, PersonalLabel[9].label)
								.max(30, PersonalLabel[10].label)
								.required(PersonalLabel[8].label),
							firstname: Yup.string()
								.min(2, PersonalLabel[9].label)
								.max(78, PersonalLabel[10].label)
								.required(PersonalLabel[8].label),
							lastname: Yup.string()
								.min(2, PersonalLabel[9].label)
								.max(78, PersonalLabel[10].label)
								.required(PersonalLabel[8].label)
						})}
						onSubmit={async (values, { setSubmitting }) => {
							// Global axios defaults
							axios.defaults.headers.common['Accept'] = 'application/json';
							axios.defaults.headers.common['Content-Type'] =
								'application/x-www-form-urlencoded';
							axios.defaults.headers.common['X-CSRFToken'] = Cookies.get(
								'csrftoken'
							);

							const body = {
								username: values.username,
								first_name: values.firstname,
								last_name: values.lastname,
								settings: profile.settings,
								large_page_size_threshold: profile.large_page_size_threshold
							};

							try {
								const response = await axios.patch(userApiEndpoint, body);
								const data = await response.data;

								// Promise timeout
								await sleep(500);

								if (Math.floor(response.status / 200) === 1) {
									if (data) {
										if (data.username) {
											setUsernameError(false);
										}

										setSuccessMsg(PersonalLabel[11].label);
										setTimeout(() => setShowNotificationStatus(true), 1500);
										setDisableInputFields(!disableInputFields);
									}
								}
							} catch (error) {
								setSubmitting(false);

								if (error.response) {
									if (error.response.data) {
										if (error.response.data.username) {
											setErrorMsg(error.response.data.username);
											setUsernameError(true);
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
						{({ values, errors, handleBlur, handleSubmit, isSubmitting }) => (
							<form onSubmit={handleSubmit}>
								<div>
									<div>
										<div>
											<h3 className="text-lg leading-6 font-medium text-gray-900">
												{PersonalLabel[0].label}
											</h3>
											<p className="mt-1 text-sm leading-5 text-gray-500">
												{PersonalLabel[0].description}
											</p>
										</div>
									</div>
									<div className="mt-8">
										<div className="grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
											<div className="sm:col-span-6">
												<label
													htmlFor="username"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PersonalLabel[1].label}
												</label>
												<div className="mt-1 relative flex rounded-md shadow-xs-sm">
													<input
														type="text"
														id="username"
														value={values.username}
														name="username"
														disabled={!disableInputFields}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															!disableInputFields &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.username || usernameError
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="username"
														onChange={handleUserNameInputChange}
														onBlur={handleBlur}
													/>
													{errors.username || usernameError ? (
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
												{usernameError && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errorMsg && errorMsg}
													</span>
												)}
												{errors.username && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.username && errors.username}
													</span>
												)}
											</div>

											<div className="sm:col-span-3">
												<label
													htmlFor="firstname"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PersonalLabel[2].label}
												</label>
												<div className="mt-1 relative rounded-md shadow-xs-sm">
													<input
														type="text"
														id="firstname"
														value={values.firstname}
														name="firstname"
														disabled={!disableInputFields}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															!disableInputFields &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.firstname
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="firstname"
														onChange={handleFirstNameInputChange}
														onBlur={handleBlur}
													/>
													{errors.firstname && (
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
													)}
												</div>
												{errors.firstname && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.firstname && errors.firstname}
													</span>
												)}
											</div>

											<div className="sm:col-span-3">
												<label
													htmlFor="lastname"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PersonalLabel[3].label}
												</label>
												<div className="mt-1 relative rounded-md shadow-xs-sm">
													<input
														type="text"
														id="lastname"
														value={values.lastname}
														name="lastname"
														disabled={!disableInputFields}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															!disableInputFields &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														} ${
															errors.lastname
																? 'border-red-300'
																: 'border-gray-300'
														}`}
														aria-describedby="lastname"
														onChange={handleLastNameInputChange}
														onBlur={handleBlur}
													/>
													{errors.lastname && (
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
													)}
												</div>
												{errors.lastname && (
													<span className="block mt-2 text-xs leading-5 text-red-700">
														{errors.lastname && errors.lastname}
													</span>
												)}
											</div>

											<div className="sm:col-span-6">
												<label
													htmlFor="email"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
													{PersonalLabel[4].label}
												</label>
												<div className="mt-1 rounded-md shadow-xs-sm">
													<input
														id="email"
														type="email"
														value={email}
														disabled={true}
														className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 opacity-50 bg-gray-300 cursor-not-allowed"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-8 border-t border-gray-300 pt-5">
									<div className="flex justify-between xs:flex-col sm:flex-row md:flex-col lg:flex-row">
										<div className="flex justify-start xs:order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-auto">
											<span className="inline-flex sm:inline-block lg:inline-flex rounded-md shadow-xs-sm sm:flex-1 lg:flex-none">
												<button
													type="submit"
													disabled={disableInputFields}
													className={`inline-flex xs:w-full lg:w-auto justify-center w-full rounded-md border border-gray-300 ml-3 xs:ml-0 xs:mt-3 lg:mt-0 sm:ml-0 px-4 py-2 text-sm leading-5 font-medium text-white bg-indigo-600 transition duration-150 ease-in-out ${
														disableInputFields
															? 'opacity-50 bg-indigo-300 cursor-not-allowed'
															: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700'
													}`}
													onClick={handleEditProfile}
												>
													{PersonalLabel[5].label}
												</button>
											</span>
											<span className="xs:w-full ml-3 xs:ml-0 xs:mt-3 lg:mt-0 lg:ml-3 inline-flex rounded-md shadow-xs-sm">
												<button
													type="submit"
													disabled={!disableInputFields && !isSubmitting}
													className={`inline-flex xs:w-full justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
														!disableInputFields && !isSubmitting
															? 'opacity-50 bg-green-300 cursor-not-allowed'
															: 'hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700'
													}`}
												>
													{isSubmitting
														? PersonalLabel[12].label
														: PersonalLabel[7].label}
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
													<div class="flex">
														<div class="flex-shrink-0">
															<svg
																class="h-5 w-5 text-green-400"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fill-rule="evenodd"
																	d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																	clip-rule="evenodd"
																/>
															</svg>
														</div>
														<div class="ml-2">
															<p class="text-sm leading-5 font-medium text-green-800">
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
			</ProfileSettingsPersonalDiv>
		</>
	) : (
		<ProfileSettingsPersonalDiv className="mb-5 max-w-full">
			<Skeleton duration={2} width={320} height={586} />
		</ProfileSettingsPersonalDiv>
	);
};

ProfileSettingsPersonal.propTypes = {};

export default ProfileSettingsPersonal;
