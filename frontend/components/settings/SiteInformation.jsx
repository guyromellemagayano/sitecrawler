import { Fragment, useState, useEffect } from 'react';
import { Transition } from '@tailwindui/react';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SiteInformationDiv = styled.div``;

const SiteInformation = (props) => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableInputFields, setDisableInputFields] = useState(0);
	const [siteName, setSiteName] = useState('');
	const [siteUrl, setSiteUrl] = useState('');
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);

	const updateSiteSettings = async (endpoint, formData) => {
		const response = await fetch(endpoint, {
			method: 'PUT',
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
				setSuccessMsg('Site information update successfully.');
				setTimeout(() => setShowNotificationStatus(true), 1500);
				setDisableInputFields(!disableInputFields);
			} else {
				setErrorMsg('Site information update failed. Please try again.');
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

	const handleSiteUpdate = async (e) => {
		e.preventDefault();

		const body = {
			name: e.currentTarget.site_name.value,
			url: e.currentTarget.site_url.value
		};

		await updateSiteSettings(`/api/site/${props.queryData.siteId}/`, body);
	};

	const handleEditSiteDetails = (e) => {
		e.preventDefault();

		setDisableInputFields(!disableInputFields);
	};

	const handleSiteNameInputChange = (e) => {
		setSiteName(e.target.value);
	};

	useEffect(() => {
		if (
			typeof props.siteData === 'object' &&
			props.siteData !== undefined &&
			props.siteData !== null
		) {
			setSiteName(props.siteData.name);
			setSiteUrl(props.siteData.url);
		}
	}, [props]);

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 7500);
	}, [showNotificationStatus]);

	return (
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

			<SiteInformationDiv
				className={`mb-5 max-w-full bg-white shadow-xs rounded-lg`}
			>
				<div className={`px-4 py-5 sm:p-6`}>
					<form onSubmit={handleSiteUpdate}>
						<div>
							<div>
								<div>
									<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
										{props.settingsLabelData[2].label}
									</h3>
									<p className={`mt-1 text-sm leading-5 text-gray-500`}>
										{props.settingsLabelData[3].label}
									</p>
								</div>
								<div
									className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
								>
									<div className={`sm:col-span-6`}>
										<label
											htmlFor={`site_name`}
											className={`block text-sm font-medium leading-5 text-gray-700`}
										>
											{props.settingsLabelData[4].label}
										</label>
										<div className={`mt-1 flex rounded-md shadow-xs-sm`}>
											<input
												type={`text`}
												id={`site_name`}
												value={siteName}
												name={`site_name`}
												disabled={disableInputFields == 0 ? true : false}
												className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
													disableInputFields == 0 &&
													'opacity-50 bg-gray-300 cursor-not-allowed'
												}`}
												onChange={handleSiteNameInputChange}
											/>
										</div>
									</div>
								</div>
								<div
									className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
								>
									<div className={`sm:col-span-6`}>
										<label
											htmlFor={`password1`}
											className={`block text-sm font-medium leading-5 text-gray-700`}
										>
											{props.settingsLabelData[5].label}
										</label>
										<div className={`mt-1 flex rounded-md shadow-xs-sm`}>
											<input
												type={`text`}
												id={`site_url`}
												value={siteUrl}
												name={`site_url`}
												disabled={`disabled`}
												className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 opacity-50 bg-gray-300 cursor-not-allowed`}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={`mt-8 border-t border-gray-300 pt-5`}>
							<div className={`flex justify-between`}>
								<div className={`flex justify-start`}>
									<span className={`inline-flex rounded-md shadow-xs-sm`}>
										<button
											type={`submit`}
											disabled={disableInputFields == 1 ? true : false}
											className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
												disableInputFields == 1
													? 'opacity-50 bg-indigo-300 cursor-not-allowed'
													: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700'
											}`}
											onClick={handleEditSiteDetails}
										>
											{props.settingsLabelData[6].label}
										</button>
									</span>

									<span className={`inline-flex rounded-md shadow-xs-sm`}>
										<button
											disabled={disableInputFields == 1 ? false : true}
											className={`inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
												disableInputFields == 1
													? 'hover:text-gray-500 focus:outline-none'
													: 'opacity-50 cursor-not-allowed'
											}`}
											onClick={handleEditSiteDetails}
										>
											{props.settingsLabelData[7].label}
										</button>
									</span>
								</div>
								<div className={`flex justify-end`}>
									<span className={`ml-3 inline-flex rounded-md shadow-xs-sm`}>
										<button
											type={`submit`}
											disabled={disableInputFields == 1 ? false : true}
											className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
												disableInputFields == 0
													? 'opacity-50 bg-green-300 cursor-not-allowed'
													: 'hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700'
											}`}
										>
											{props.settingsLabelData[8].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</SiteInformationDiv>
		</Fragment>
	);
};

export default SiteInformation;

SiteInformation.propTypes = {
	errorMsg: PropTypes.string,
	successMsg: PropTypes.string,
	disableInputFields: PropTypes.func,
	siteName: PropTypes.string,
	siteUrl: PropTypes.string,
	fetchSiteSettings: PropTypes.func,
	updateSiteSettings: PropTypes.func,
	handleSiteUpdate: PropTypes.func,
	handleEditSiteDetails: PropTypes.func,
	handleSiteNameInputChange: PropTypes.func
};
