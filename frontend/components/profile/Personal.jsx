import { Transition } from '@tailwindui/react';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import fetchJson from 'hooks/fetchJson';
import PersonalLabel from 'public/label/components/profile/Personal.json';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

const ProfileSettingsPersonalDiv = styled.div``;

const ProfileSettingsPersonal = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableInputFields, setDisableInputFields] = useState(0);
	const [username, setUsername] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);

	const { data: profile } = useSWR(`/api/auth/user/`, () =>
		fetchProfileSettings(`/api/auth/user/`)
	);

	useEffect(() => {
		if (profile !== '' && profile !== undefined) {
			setUsername(profile.username);
			setFirstname(profile.first_name);
			setLastname(profile.last_name);
			setEmail(profile.email);
		}
	}, [profile]);

	const fetchProfileSettings = async (endpoint) => {
		const siteProfileData = await fetchJson(endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});

		return siteProfileData;
	};

	const updateProfileSettings = async (endpoint, formData) => {
		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			},
			body: JSON.stringify(formData)
		});

		const data = await response.json();

		if (response.ok && response.status === 200) {
			if (data) {
				setSuccessMsg('Profile information update successfully.');
				setTimeout(() => setShowNotificationStatus(true), 1500);
				setDisableInputFields(!disableInputFields);
			} else {
				setErrorMsg('Profile information update failed. Please try again.');
				setTimeout(() => setShowNotificationStatus(true), 1500);
			}
		} else {
			const error = new Error(response.statusText);

			error.response = response;
			error.data = data;

			setErrorMsg('An unexpected error occurred. Please try again.');
			setTimeout(() => setShowNotificationStatus(true), 1500);

			throw error;
		}
	};

	const handleProfileUpdate = async (e) => {
		e.preventDefault();

		const body = {
			username: e.currentTarget.user_name.value,
			first_name: e.currentTarget.first_name.value,
			last_name: e.currentTarget.last_name.value
		};

		await updateProfileSettings(`/api/auth/user/`, body);
	};

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
			setTimeout(() => setShowNotificationStatus(false), 7500);
	}, [showNotificationStatus]);

	return (
		<Fragment>
			{!profile ? (
				<ProfileSettingsPersonalDiv className={`mb-5 max-w-full`}>
					<Skeleton duration={2} width={320} height={586} />
				</ProfileSettingsPersonalDiv>
			) : (
				<Fragment>
					<Transition show={showNotificationStatus}>
						<div
							className={`fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end`}
						>
							<Transition.Child
								enter='transform ease-out duration-300 transition'
								enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
								enterTo='translate-y-0 opacity-100 sm:translate-x-0'
								leave='transition ease-in duration-100'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
								className='max-w-sm w-full'
							>
								<div
									className={`bg-white shadow-lg rounded-lg pointer-events-auto`}
								>
									<div className={`rounded-lg shadow-xs overflow-hidden`}>
										<div className={`p-4`}>
											<div className={`flex items-start`}>
												<div className={`flex-shrink-0`}>
													{errorMsg ? (
														<svg
															className={`h-8 w-8 text-red-400`}
															fill='currentColor'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
																clipRule='evenodd'
															></path>
														</svg>
													) : successMsg ? (
														<svg
															className={`h-8 w-8 text-green-400`}
															fill='currentColor'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
																clipRule='evenodd'
															></path>
														</svg>
													) : (
														<svg
															className={`h-8 w-8 text-gray-400`}
															fill='currentColor'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
																clipRule='evenodd'
															></path>
														</svg>
													)}
												</div>
												<div className={`ml-3 w-0 flex-1 pt-0.5`}>
													<p
														className={`text-sm leading-5 font-medium ${
															errorMsg !== undefined && errorMsg !== ''
																? 'text-red-500'
																: 'text-gray-900'
														} ${
															successMsg !== undefined && successMsg !== ''
																? 'text-green-500'
																: 'text-gray-900'
														}`}
													>
														{errorMsg !== undefined && errorMsg !== ''
															? 'Update Failed!'
															: successMsg !== undefined && successMsg !== ''
															? 'Update Success!'
															: 'Verifying...'}
													</p>
													<p className={`mt-1 text-sm leading-5 text-gray-500`}>
														{errorMsg !== undefined && errorMsg !== ''
															? errorMsg
															: successMsg}
													</p>
												</div>
												<div className={`ml-4 flex-shrink-0 flex`}>
													<button
														className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
														onClick={() =>
															setTimeout(
																() =>
																	setShowNotificationStatus(
																		!showNotificationStatus
																	),
																150
															)
														}
													>
														<svg
															className={`h-5 w-5`}
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path
																fillRule='evenodd'
																d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
																clipRule='evenodd'
															/>
														</svg>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Transition.Child>
						</div>
					</Transition>
					<ProfileSettingsPersonalDiv
						className={`mb-5 max-w-full bg-white shadow-xs rounded-lg`}
					>
						<div className={`px-4 py-5 sm:p-6`}>
							<form onSubmit={handleProfileUpdate}>
								<div>
									<div>
										<div>
											<h3
												className={`text-lg leading-6 font-medium text-gray-900`}
											>
												{PersonalLabel[0].label}
											</h3>
											<p className={`mt-1 text-sm leading-5 text-gray-500`}>
												{PersonalLabel[0].description}
											</p>
										</div>
										<div
											className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
										>
											<div className={`sm:col-span-6`}>
												<label
													htmlFor={`username`}
													className={`block text-sm font-medium leading-5 text-gray-700`}
												>
													{PersonalLabel[1].label}
												</label>
												<div className={`mt-1 flex rounded-md shadow-xs-sm`}>
													<input
														type={`text`}
														id={`username`}
														value={username}
														name={`user_name`}
														disabled={disableInputFields == 0 ? true : false}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															disableInputFields == 0 &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														}`}
														onChange={handleUserNameInputChange}
													/>
												</div>
											</div>
										</div>
									</div>
									<div className={`mt-8 border-t border-gray-300`}>
										<div
											className={`grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
										>
											<div className={`sm:col-span-3`}>
												<label
													htmlFor={`first_name`}
													className={`block text-sm font-medium leading-5 text-gray-700`}
												>
													{PersonalLabel[2].label}
												</label>
												<div className={`mt-1 rounded-md shadow-xs-sm`}>
													<input
														type={`text`}
														id={`first_name`}
														value={firstname}
														name={`first_name`}
														disabled={disableInputFields == 0 ? true : false}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															disableInputFields == 0 &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														}`}
														onChange={handleFirstNameInputChange}
													/>
												</div>
											</div>

											<div className={`sm:col-span-3`}>
												<label
													htmlFor={`last_name`}
													className={`block text-sm font-medium leading-5 text-gray-700`}
												>
													{PersonalLabel[3].label}
												</label>
												<div className={`mt-1 rounded-md shadow-xs-sm`}>
													<input
														type={`text`}
														id={`last_name`}
														value={lastname}
														name={`last_name`}
														disabled={disableInputFields == 0 ? true : false}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
															disableInputFields == 0 &&
															'opacity-50 bg-gray-300 cursor-not-allowed'
														}`}
														onChange={handleLastNameInputChange}
													/>
												</div>
											</div>

											<div className={`sm:col-span-6`}>
												<label
													htmlFor={`email`}
													className={`block text-sm font-medium leading-5 text-gray-700`}
												>
													{PersonalLabel[4].label}
												</label>
												<div className={`mt-1 rounded-md shadow-xs-sm`}>
													<input
														id={`email`}
														type={`email`}
														value={email}
														disabled={`disabled`}
														className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 opacity-50 bg-gray-300 cursor-not-allowed`}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className={`mt-8 border-t border-gray-300 pt-5`}>
									<div
										className={`flex justify-between xs:flex-col sm:flex-row md:flex-col lg:flex-row`}
									>
										<div
											className={`flex justify-start xs:flex-col xs:order-2 sm:flex-row sm:flex-1 sm:grid sm:grid-cols-2 sm:gap-1 sm:w-2/3 md:flex-col sm:w-full lg:order-1 lg:w-auto lg:flex lg:flex-row`}
										>
											<span
												className={`inline-flex sm:inline-block lg:inline-flex rounded-md shadow-xs-sm sm:flex-1 lg:flex-none`}
											>
												<button
													type={`submit`}
													disabled={disableInputFields == 1 ? true : false}
													className={`inline-flex xs:w-full lg:w-auto justify-center w-full rounded-md border border-gray-300 ml-3 xs:ml-0 xs:mt-3 sm:ml-0 px-4 py-2 bg-white text-sm leading-5 font-medium text-white bg-indigo-600 transition duration-150 ease-in-out ${
														disableInputFields == 1
															? 'opacity-50 bg-indigo-300 cursor-not-allowed'
															: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700'
													}`}
													onClick={handleEditProfile}
												>
													{PersonalLabel[5].label}
												</button>
											</span>

											<span
												className={`inline-flex sm:inline-block lg:inline-flex rounded-md shadow-xs-sm sm:flex-1 lg:flex-none`}
											>
												<button
													disabled={disableInputFields == 1 ? false : true}
													className={`inline-flex xs:w-full lg:w-auto justify-center w-full rounded-md border border-gray-300 ml-3 xs:ml-0 xs:mt-3 sm:ml-0 px-4 py-2 bg-white text-sm sm:text-sm leading-5 sm:leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 ${
														disableInputFields == 1
															? 'hover:text-gray-500 focus:outline-none'
															: 'opacity-50 cursor-not-allowed'
													}`}
													onClick={handleEditProfile}
												>
													{PersonalLabel[6].label}
												</button>
											</span>
										</div>
										<div
											className={`flex justify-end xs:order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-2 lg:w-auto`}
										>
											<span
												className={`xs:w-full ml-3 xs:ml-0 xs:mt-3 inline-flex rounded-md shadow-xs-sm`}
											>
												<button
													type={`submit`}
													className={`inline-flex xs:w-full justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
														disableInputFields == 0
															? 'opacity-50 bg-green-300 cursor-not-allowed'
															: 'hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700'
													}`}
												>
													{PersonalLabel[7].label}
												</button>
											</span>
										</div>
									</div>
								</div>
							</form>
						</div>
					</ProfileSettingsPersonalDiv>
				</Fragment>
			)}
		</Fragment>
	);
};

export default ProfileSettingsPersonal;

ProfileSettingsPersonal.propTypes = {
	errorMsg: PropTypes.string,
	successMsg: PropTypes.string,
	disableInputFields: PropTypes.func,
	username: PropTypes.string,
	firstname: PropTypes.string,
	lastname: PropTypes.string,
	email: PropTypes.string
};
