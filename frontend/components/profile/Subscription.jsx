import { Transition } from '@tailwindui/react';
import { useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import fetchJson from 'hooks/fetchJson';
import Link from 'next/link';
import PaymentMethodForm from 'components/form/PaymentMethodForm';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import SubscriptionLabel from 'public/label/pages/subscriptions.json';
import useSWR from 'swr';
import Layout from 'components/Layout';

const ProfileSettingsSubscriptionDiv = styled.div``;

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

const ProfileSettingsSubscription = () => {
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableInputFields, setDisableInputFields] = useState(0);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [subscriptionId, setSubscriptionId] = useState(undefined);
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);

	const { data: subscriptions, error: subscriptionsError } = useSWR(
		() => `/api/stripe/subscription/`,
		fetcher,
		{
			refreshInterval: 1000
		}
	);

	const {
		data: subscription,
		error: subscriptionError,
		mutate: subscriptionUpdated
	} = useSWR(() => `/api/stripe/subscription/current/`, fetcher, {
		refreshInterval: 1000
	});

	const { data: paymentMethods, error: paymentMethodsError } = useSWR(
		() => `/api/stripe/payment-method/`,
		fetcher,
		{
			refreshInterval: 1000
		}
	);

	const {
		data: currentPaymentMethod,
		error: currentPaymentMethodError
	} = useSWR(() => `/api/stripe/payment-method/default/`, fetcher, {
		refreshInterval: 1000
	});

	useEffect(() => {
		if (
			subscription !== '' &&
			subscription !== undefined &&
			subscriptions !== '' &&
			subscriptions !== undefined &&
			paymentMethods !== '' &&
			paymentMethods !== undefined &&
			currentPaymentMethod !== '' &&
			currentPaymentMethod !== undefined
		) {
			paymentMethods
				.filter((paymentMethod) => paymentMethod.id === currentPaymentMethod.id)
				.map((val) => {
					setPaymentMethod(val);
				});
			setSubscriptionId(subscription.id);
		}
	}, [paymentMethods, currentPaymentMethod, subscription, subscriptions]);

	const updateCardInformation = async (endpoint, formData) => {
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
				setSuccessMsg('Card information update successfully.');
				setTimeout(() => setShowNotificationStatus(true), 1500);
				setDisableInputFields(!disableInputFields);
			} else {
				setErrorMsg('Card information update failed. Please try again.');
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

	const handlePaymentMethodUpdate = async (e) => {
		e.preventDefault();

		// TODO: body variable objects
		const body = {};

		// TODO: updateCardInformation(API_ENDPOINT_HERE, body)
		await updateCardInformation(``, body);
	};

	const handleEditPaymentMethod = (e) => {
		e.preventDefault();

		setDisableInputFields(!disableInputFields);
	};

	const handlePaymentMethodInputChange = (e) => {
		setPaymentMethod(e.target.value);
	};

	const handlePaymentPeriodInputChange = (e) => {
		setPaymentPeriod(e.target.value);
	};

	const handlePaymentMethodModal = (e) => {
		e.preventDefault();

		setShowModal(!showModal);
	};

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 7500);
	}, [showNotificationStatus]);

	{
		subscriptionsError && <Layout>{subscriptionsError.message}</Layout>;
	}
	{
		subscriptionError && <Layout>{subscriptionError.message}</Layout>;
	}
	{
		currentPaymentMethodError && (
			<Layout>{currentPaymentMethodError.message}</Layout>
		);
	}
	{
		paymentMethodsError && <Layout>{paymentMethodsError.message}</Layout>;
	}

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
			<Transition show={showModal}>
				<div className={`fixed z-10 inset-0 overflow-y-auto`}>
					<div
						className={`flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0`}
					>
						<Transition.Child
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<div className={`fixed inset-0 transition-opacity`}>
								<div
									className={`absolute inset-0 bg-gray-500 opacity-75`}
								></div>
							</div>
						</Transition.Child>
						<span
							className={`hidden sm:inline-block sm:align-middle sm:h-screen`}
						></span>
						&#8203;
						<Transition.Child
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							className='inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div
								className={`hidden sm:block absolute top-0 right-0 pt-4 pr-4`}
							>
								<button
									type='button'
									className={`text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
									aria-label='Close'
									onClick={() =>
										setTimeout(() => {
											setShowModal(!showModal);
											setDisableInputFields(0);
										}, 150)
									}
								>
									<svg
										className={`h-6 w-6`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>
							<div>
								<div className={`text-center sm:mt-3`}>
									<h2
										className={`mb-6 text-lg leading-6 font-medium text-gray-900" id="modal-headline`}
									>
										{SubscriptionLabel[7].label}
									</h2>
								</div>
							</div>

							<div>
								<PaymentMethodForm
									subscriptionId={subscriptionId}
									closeForm={() => setShowModal(false)}
									disableInputFields={() => setDisableInputFields(0)}
									onSubscriptionUpdated={subscriptionUpdated}
								/>
							</div>
						</Transition.Child>
					</div>
				</div>
			</Transition>
			<ProfileSettingsSubscriptionDiv
				className={`my-5 max-w-full bg-white shadow-xs rounded-lg`}
			>
				<div className={`px-4 py-5 sm:p-6`}>
					<form onSubmit={handlePaymentMethodUpdate}>
						<div>
							<div>
								<div>
									<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
										{SubscriptionLabel[5].label}
									</h3>
									<p className={`mt-1 text-sm leading-5 text-gray-500`}>
										{SubscriptionLabel[5].description}
									</p>
								</div>
								<div
									className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
								>
									<div className={`sm:col-span-6`}>
										<label
											htmlFor={`paymentMethod`}
											className={`block text-sm font-medium leading-5 text-gray-700`}
										>
											{SubscriptionLabel[6].label}
										</label>
										<div className={`mt-1 flex rounded-md shadow-xs-sm`}>
											<input
												type={`text`}
												id={`paymentMethod`}
												value={
													paymentMethod
														? paymentMethod.card.brand.charAt(0).toUpperCase() +
														  paymentMethod.card.brand.slice(1) +
														  ' - ' +
														  ' ' +
														  '****' +
														  ' ' +
														  paymentMethod.card.last4
														: ''
												}
												name={`paymentMethod`}
												disabled={disableInputFields == 0 ? true : false}
												className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
													disableInputFields == 0 &&
													'opacity-50 bg-gray-300 cursor-not-allowed'
												}`}
												onChange={handlePaymentMethodInputChange}
												onClick={handlePaymentMethodModal}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={`mt-8 border-t border-gray-200 pt-5`}>
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
											onClick={handleEditPaymentMethod}
										>
											{SubscriptionLabel[9].label}
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
											onClick={handleEditPaymentMethod}
										>
											{SubscriptionLabel[10].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</ProfileSettingsSubscriptionDiv>
		</Fragment>
	);
};

export default ProfileSettingsSubscription;

ProfileSettingsSubscription.propTypes = {};
