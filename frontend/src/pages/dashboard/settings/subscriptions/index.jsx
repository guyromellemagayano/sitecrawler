import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js';
import { Transition } from '@tailwindui/react';
import { useMemo, useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Layout from 'components/Layout';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import PropTypes from 'prop-types';
import SiteFooter from 'components/footer/SiteFooter';
import styled from 'styled-components';
import SubscriptionLabel from 'public/label/pages/subscriptions.json';
import PaymentMethodFormLabel from 'public/label/components/form/PaymentMethodForm.json';
import useSWR from 'swr';
import useUser from 'hooks/useUser';

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

const useOptions = () => {
	const options = useMemo(() => ({
		style: {
			base: {
				'fontFamily':
					'Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
				'::placeholder': {
					color: '#aab7c4'
				},
				'color': '#424770',
				'letterSpacing': '0.025em',
				'lineHeight': '1.25rem'
			},
			invalid: {
				color: '#9e2146'
			}
		}
	}));

	return options;
};

const SubscriptionsDiv = styled.section`
	.confetti-bg-img {
		background: url('/img/backgrounds/subscription-success-bg.png');
		background-size: cover;
		background-position: top center;
		background-repeat: no-repeat;
		min-height: 16rem;
		width: 100%;
		position: absolute;
		z-index: -1;
	}

	.input-group {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
`;

const Subscriptions = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [disableInputFields, setDisableInputFields] = useState(0);
	const [showNotificationStatus, setShowNotificationStatus] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState(undefined);
	const [togglePaymentPeriod, setTogglePaymentPeriod] = useState(false);
	const [showNewActivePlanModal, setShowNewActivePlanModal] = useState(false);
	const [updatedPlanName, setUpdatedPlanName] = useState(undefined);
	const [updatedPlanId, setUpdatedPlanId] = useState(undefined);
	const [showChangeToBasicModal, setShowChangeToBasicModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingBasic, setLoadingBasic] = useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = useState(
		false
	);
	const [basicPlanId, setBasicPlanId] = useState(undefined);
	const [basicPlanName, setBasicPlanName] = useState(undefined);

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();
	const pageTitle = 'Subscriptions';

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: paymentMethods, error: paymentMethodsError } = useSWR(
		() => `/api/stripe/payment-method/`,
		fetcher
	);

	const {
		data: currentPaymentMethod,
		error: currentPaymentMethodError,
		mutate: currentPaymentMethodUpdated
	} = useSWR(() => `/api/stripe/payment-method/default/`, fetcher);

	const { data: subscriptions, error: subscriptionsError } = useSWR(
		() => `/api/stripe/subscription/`,
		fetcher
	);

	const {
		data: subscription,
		error: subscriptionError,
		mutate: subscriptionUpdated
	} = useSWR(() => `/api/stripe/subscription/current/`, fetcher);

	// console.log('[subscriptions]', subscriptions, subscription)

	const addPaymentMethod = async (endpoint, payload) => {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			},
			body: JSON.stringify({ id: payload.paymentMethod.id })
		});

		const data = await response.json();

		if (response.ok && response.status === 200) {
			// console.log(data)

			setTimeout(() => {
				currentPaymentMethodUpdated().then((info) => {
					if (info.id !== undefined) {
						// TODO: selectPlan
						setShowModal(false);
						setDisableInputFields(0);
						setSuccessMsg(
							'Card information added successfully. Processing your plan now.'
						);
						setShowNotificationStatus(true);

						setTimeout(() => {
							selectPlan(updatedPlanId, updatedPlanName);
						}, 1000);
					} else {
						setErrorMsg('An unexpected error occurred. Please try again.');
						setShowNotificationStatus(true);

						throw new Error(data.message);
					}
				});
			}, 1000);
		} else {
			setErrorMsg('An unexpected error occurred. Please try again.');
			setShowNotificationStatus(true);

			throw new Error(data.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		setLoading(true);

		const payload = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardNumberElement)
		});

		// console.log('[PaymentMethod]', payload);

		if (payload.error) {
			if (payload.error.code === 'incomplete_number') {
				alert('ERROR: ' + payload.error.message);
			}

			if (payload.error.code === 'incomplete_expiry') {
				alert('ERROR: ' + payload.error.message);
			}

			if (payload.error.code === 'incomplete_cvc') {
				alert('ERROR: ' + payload.error.message);
			}

			setLoading(false);
		} else {
			addPaymentMethod('/api/stripe/payment-method/', payload);
		}
	};

	const selectPlan = async (id, name) => {
		if (name === 'Basic') {
			await fetch('/api/stripe/subscription/current/', {
				method: 'DELETE',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-CSRFToken': Cookies.get('csrftoken')
				}
			});

			setTimeout(() => {
				subscriptionUpdated().then((info) => {
					// console.log(info);
					if (info.id === null) {
						setLoadingProMonthly(false);
						setLoadingAgencyMonthly(false);
						setLoadingProSemiAnnually(false);
						setLoadingAgencySemiAnnually(false);
						setShowChangeToBasicModal(!showChangeToBasicModal);
					}
				});
			}, 2000);

			return false;
		}

		subscriptions.results
			.filter((sub) => sub.id === id)
			.map((val) => {
				if (
					val.group.name === 'Pro' &&
					val.price.recurring.interval === 'month' &&
					val.price.recurring.interval_count == 1
				) {
					setLoadingBasic(false);
					setLoadingProMonthly(true);
					setLoadingAgencyMonthly(false);
					setLoadingProSemiAnnually(false);
					setLoadingAgencySemiAnnually(false);
				} else if (
					val.group.name === 'Agency' &&
					val.price.recurring.interval === 'month' &&
					val.price.recurring.interval_count == 1
				) {
					setLoadingBasic(false);
					setLoadingProMonthly(false);
					setLoadingAgencyMonthly(true);
					setLoadingProSemiAnnually(false);
					setLoadingAgencySemiAnnually(false);
				} else if (
					val.group.name === 'Pro' &&
					val.price.recurring.interval === 'month' &&
					val.price.recurring.interval_count == 6
				) {
					setLoadingBasic(false);
					setLoadingProMonthly(false);
					setLoadingAgencyMonthly(false);
					setLoadingProSemiAnnually(true);
					setLoadingAgencySemiAnnually(false);
				} else {
					setLoadingBasic(false);
					setLoadingProMonthly(false);
					setLoadingAgencyMonthly(false);
					setLoadingProSemiAnnually(false);
					setLoadingAgencySemiAnnually(true);
				}
			});

		handleSubscriptionUpdate(id);
	};

	const handleSubscriptionUpdate = async (subId) => {
		await fetch('/api/stripe/subscription/current/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			},
			body: JSON.stringify({ id: subId })
		});

		setTimeout(() => {
			subscriptionUpdated().then((info) => {
				// console.log(info);
				if (info.status === 'PAID') {
					subscriptions.results
						.filter((sub) => sub.id === info.id)
						.map((val) => {
							setUpdatedPlanName(val.group.name);
							setUpdatedPlanId(val.id);
						});

					setShowNewActivePlanModal(true);
				} else if (info.status === 'WAITING_PAYMENT') {
					handleSubscriptionUpdate(subId);
				}
			});
		}, 2000);
	};

	const handleCurrentPaymentPeriod = (sub, subs) => {
		let intervalCount = '';

		subs &&
			sub &&
			subs.results
				.filter((result) => result.id === sub.id)
				.map((val, key) => {
					intervalCount = val.price.recurring.interval_count;
				});

		return intervalCount;
	};

	useEffect(() => {
		if (
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
		}

		if (paymentMethods && paymentMethods.id === null) {
			setPaymentMethod(false);
		} else {
			setPaymentMethod(true);
		}
	}, [paymentMethods, currentPaymentMethod]);

	useEffect(() => {
		if (showNotificationStatus === true)
			setTimeout(() => setShowNotificationStatus(false), 7500);
	}, [showNotificationStatus]);

	useEffect(() => {
		if (handleCurrentPaymentPeriod(subscription, subscriptions) > 1) {
			setTogglePaymentPeriod(true);
		} else {
			setTogglePaymentPeriod(false);
		}
	}, [subscription, subscriptions]);

	{
		userError && <Layout>{userError.message}</Layout>;
	}
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
		<Layout>
			{user && subscriptions && subscription ? (
				<Fragment>
					<Head>
						<title>{pageTitle}</title>
					</Head>

					<SubscriptionsDiv
						className={`h-screen flex overflow-hidden bg-gray-300`}
					>
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
							<div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
								<button
									className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
									aria-label={`Open sidebar`}
									onClick={() =>
										setTimeout(
											() => setOpenMobileSidebar(!openMobileSidebar),
											150
										)
									}
								>
									<svg
										className={`h-6 w-5`}
										stroke={`currentColor`}
										fill={`none`}
										viewBox={`0 0 24 24`}
									>
										<path
											strokeLinecap={`round`}
											strokeLinejoin={`round`}
											strokeWidth={`2`}
											d={`M4 6h16M4 12h16M4 18h16`}
										/>
									</svg>
								</button>
							</div>
							<main
								className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
								tabIndex={`0`}
							>
								<div className={`max-w-full px-4 py-4 sm:px-6 md:px-8`}>
									<div>
										<Transition show={showNotificationStatus}>
											<div
												className={`fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end`}
											>
												<Transition.Child
													enter="transform ease-out duration-300 transition"
													enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
													enterTo="translate-y-0 opacity-100 sm:translate-x-0"
													leave="transition ease-in duration-100"
													leaveFrom="opacity-100"
													leaveTo="opacity-0"
													className="max-w-sm w-full"
												>
													<div
														className={`bg-white shadow-lg rounded-lg pointer-events-auto`}
													>
														<div
															className={`rounded-lg shadow-xs overflow-hidden`}
														>
															<div className={`p-4`}>
																<div className={`flex items-start`}>
																	<div className={`flex-shrink-0`}>
																		{errorMsg ? (
																			<svg
																				className={`h-8 w-8 text-red-400`}
																				fill="currentColor"
																				viewBox="0 0 24 24"
																				stroke="currentColor"
																			>
																				<path
																					fillRule="evenodd"
																					d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
																					clipRule="evenodd"
																				></path>
																			</svg>
																		) : successMsg ? (
																			<svg
																				className={`h-8 w-8 text-green-400`}
																				fill="currentColor"
																				viewBox="0 0 24 24"
																				stroke="currentColor"
																			>
																				<path
																					fillRule="evenodd"
																					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																					clipRule="evenodd"
																				></path>
																			</svg>
																		) : (
																			<svg
																				className={`h-8 w-8 text-gray-400`}
																				fill="currentColor"
																				viewBox="0 0 24 24"
																				stroke="currentColor"
																			>
																				<path
																					fillRule="evenodd"
																					d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
																					clipRule="evenodd"
																				></path>
																			</svg>
																		)}
																	</div>
																	<div className={`ml-3 w-0 flex-1 pt-0.5`}>
																		<p
																			className={`text-sm leading-5 font-medium ${
																				errorMsg !== undefined &&
																				errorMsg !== ''
																					? 'text-red-500'
																					: 'text-gray-900'
																			} ${
																				successMsg !== undefined &&
																				successMsg !== ''
																					? 'text-green-500'
																					: 'text-gray-900'
																			}`}
																		>
																			{errorMsg !== undefined && errorMsg !== ''
																				? 'Card Addition Failed!'
																				: successMsg !== undefined &&
																				  successMsg !== ''
																				? 'Card Addition Success!'
																				: 'Verifying...'}
																		</p>
																		<p
																			className={`mt-1 text-sm leading-5 text-gray-500`}
																		>
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
																				viewBox="0 0 20 20"
																				fill="currentColor"
																			>
																				<path
																					fillRule="evenodd"
																					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																					clipRule="evenodd"
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
														enter="ease-out duration-300"
														enterFrom="opacity-0"
														enterTo="opacity-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100"
														leaveTo="opacity-0"
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
														enter="ease-out duration-300"
														enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														enterTo="opacity-100 translate-y-0 sm:scale-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100 translate-y-0 sm:scale-100"
														leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														className="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
														role="dialog"
														aria-modal="true"
														aria-labelledby="modal-headline"
													>
														<div
															className={`hidden sm:block absolute top-0 right-0 pt-4 pr-4`}
														>
															<button
																type="button"
																className={`text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
																aria-label="Close"
																onClick={() =>
																	setTimeout(() => {
																		setShowModal(!showModal);
																		setDisableInputFields(0);
																	}, 150)
																}
															>
																<svg
																	className={`h-6 w-6`}
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M6 18L18 6M6 6l12 12"
																	/>
																</svg>
															</button>
														</div>
														<div>
															<div className={`text-center sm:mt-3`}>
																<h2
																	className={`mb-6 text-xl leading-6 font-semibold text-gray-900`}
																	id="modal-headline"
																>
																	{SubscriptionLabel[7].label}
																</h2>
															</div>
														</div>

														<div>
															<form onSubmit={handleSubmit}>
																<div className="input-group">
																	<label
																		htmlFor="card-number"
																		className={`block text-sm font-medium leading-5 text-gray-700`}
																	>
																		{PaymentMethodFormLabel[0].label}
																	</label>
																	<CardNumberElement options={options} />
																</div>
																<div className="input-group">
																	<label
																		htmlFor="expiration-date"
																		className={`block text-sm font-medium leading-5 text-gray-700`}
																	>
																		{PaymentMethodFormLabel[1].label}
																	</label>
																	<CardExpiryElement options={options} />
																</div>
																<div className="input-group">
																	<label
																		htmlFor="cvc"
																		className={`block text-sm font-medium leading-5 text-gray-700`}
																	>
																		{PaymentMethodFormLabel[2].label}
																	</label>
																	<CardCvcElement options={options} />
																</div>
																<div className={`mt-5 sm:mt-6`}>
																	<span
																		className={`flex w-full rounded-md shadow-sm sm:col-start-2`}
																	>
																		<button
																			type="submit"
																			className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
																				loading
																					? 'opacity-50 bg-indigo-300 cursor-not-allowed'
																					: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo'
																			}`}
																			disabled={loading ? true : false}
																		>
																			{loading
																				? 'Saving Changes...'
																				: PaymentMethodFormLabel[3].label}
																		</button>
																	</span>
																</div>
															</form>
														</div>
													</Transition.Child>
												</div>
											</div>
										</Transition>

										<Transition show={showNewActivePlanModal}>
											<div className={`fixed z-10 inset-0 overflow-y-auto`}>
												<div
													className={`flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0`}
												>
													<Transition.Child
														enter="ease-out duration-300"
														enterFrom="opacity-0"
														enterTo="opacity-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100"
														leaveTo="opacity-0"
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
														enter="ease-out duration-300"
														enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														enterTo="opacity-100 translate-y-0 sm:scale-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100 translate-y-0 sm:scale-100"
														leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														className="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6 lg:p-0"
														role="dialog"
														aria-modal="true"
														aria-labelledby="modal-headline"
													>
														<span className={`confetti-bg-img`} />
														<div
															className={`hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-50`}
														>
															<button
																type="button"
																className={`text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
																aria-label="Close"
																onClick={() =>
																	setTimeout(() => {
																		setShowNewActivePlanModal(
																			!showNewActivePlanModal
																		);
																	}, 150)
																}
															>
																<svg
																	className={`h-6 w-6`}
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M6 18L18 6M6 6l12 12"
																	/>
																</svg>
															</button>
														</div>
														<div>
															<img
																src={`/img/backgrounds/subscription-success-badge.png`}
																alt="badge-modal-img"
																className={`mx-auto mt-16 mb-6`}
															/>
															<div className={`text-center sm:mt-3`}>
																<h2
																	className={`mb-3 text-3xl leading-6 font-bold text-gray-900`}
																	id="modal-headline"
																>
																	{SubscriptionLabel[13].label}
																</h2>
																<p
																	className={`mb-6 text-md leading-6 font-semibold`}
																>
																	Your {updatedPlanName} plan is now active.
																</p>
																{subscriptions.results
																	.filter(
																		(result) => result.id === updatedPlanId
																	)
																	.map((val, key) => {
																		return (
																			<div
																				key={key}
																				className={`mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3`}
																			>
																				<div className={`h-full flex flex-col`}>
																					<div
																						className={`flex-1 flex flex-col`}
																					>
																						<div
																							className={`flex-1 flex flex-col justify-between p-6 bg-white sm:p-10 lg:p-6 xl:p-6`}
																						>
																							<ul
																								className={`grid grid-cols-2`}
																							>
																								{val.features.map(
																									(val2, key) => {
																										return (
																											<li
																												key={key}
																												className={`flex items-start my-1`}
																											>
																												<div
																													className={`flex-shrink-0`}
																												>
																													<svg
																														className={`h-6 w-6 text-green-500`}
																														stroke="currentColor"
																														fill="none"
																														viewBox="0 0 24 24"
																													>
																														<path
																															strokeLinecap="round"
																															strokeLinejoin="round"
																															strokeWidth="2"
																															d="M5 13l4 4L19 7"
																														/>
																													</svg>
																												</div>
																												<p
																													className={`ml-3 text-sm leading-6 font-medium text-gray-500`}
																												>
																													{val2}
																												</p>
																											</li>
																										);
																									}
																								)}
																							</ul>
																							<hr
																								className={`my-6 border-b border-gray-300`}
																							/>
																							<button
																								type="button"
																								className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo`}
																								aria-label="Start Crawling"
																								onClick={() =>
																									setTimeout(() => {
																										setShowNewActivePlanModal(
																											!showNewActivePlanModal
																										);
																									}, 150)
																								}
																							>
																								Start Crawling
																							</button>
																						</div>
																					</div>
																				</div>
																			</div>
																		);
																	})}
															</div>
														</div>
													</Transition.Child>
												</div>
											</div>
										</Transition>

										<Transition show={showChangeToBasicModal}>
											<div className={`fixed z-10 inset-0 overflow-y-auto`}>
												<div
													className={`flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0`}
												>
													<Transition.Child
														enter="ease-out duration-300"
														enterFrom="opacity-0"
														enterTo="opacity-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100"
														leaveTo="opacity-0"
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
														enter="ease-out duration-300"
														enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														enterTo="opacity-100 translate-y-0 sm:scale-100"
														leave="ease-in duration-200"
														leaveFrom="opacity-100 translate-y-0 sm:scale-100"
														leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
														className="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
														role="dialog"
														aria-modal="true"
														aria-labelledby="modal-headline"
													>
														<div>
															<div
																className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mb-3`}
															>
																<svg
																	className={`h-6 w-6 text-red-600`}
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	aria-hidden="true"
																>
																	<path
																		strokeLinecap="round"
																		strokeLinejoin="round"
																		strokeWidth="2"
																		d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
																	/>
																</svg>
															</div>
															<div className={`text-center`}>
																<h2
																	className={`mb-6 text-xl leading-6 font-semibold text-gray-900`}
																	id="modal-headline"
																>
																	{SubscriptionLabel[15].label}
																</h2>
																<p
																	className={`mb-8 text-sm leading-5 font-regular`}
																>
																	{SubscriptionLabel[15].description}
																</p>

																<button
																	type="button"
																	className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 mb-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red`}
																	aria-label="Downgrade to Basic"
																	onClick={() =>
																		setTimeout(() => {
																			selectPlan(basicPlanId, basicPlanName);
																		}, 150)
																	}
																>
																	Downgrade to Basic Plan
																</button>
																<button
																	type="button"
																	className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
																	aria-label="Cancel Downgrade to Basic"
																	onClick={() =>
																		setTimeout(() => {
																			setShowChangeToBasicModal(
																				!showChangeToBasicModal
																			);
																		}, 150)
																	}
																>
																	Cancel
																</button>
															</div>
														</div>
													</Transition.Child>
												</div>
											</div>
										</Transition>

										<div
											className={`flex items-center flex-col flex-wrap pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20`}
										>
											<div className={`text-center mb-10`}>
												<p
													className={`text-2xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10`}
												>
													{SubscriptionLabel[0].label}
												</p>
												<p
													className={`mt-3 max-w-4xl mx-auto text-md leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8`}
												>
													{SubscriptionLabel[0].description}
												</p>
											</div>

											<div className={`flex items-center justify-center`}>
												<p
													className={`text-md leading-7 font-medium text-gray-500 mx-4`}
												>
													{SubscriptionLabel[1].label}
												</p>
												<span
													role="checkbox"
													tabIndex="0"
													onClick={() =>
														setTogglePaymentPeriod(!togglePaymentPeriod)
													}
													aria-checked={togglePaymentPeriod}
													className={`${
														togglePaymentPeriod
															? 'bg-indigo-600'
															: 'bg-gray-200'
													} relative inline-flex items-center flex-shrink-0 h-6 w-12 mx-auto border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline`}
												>
													<span
														aria-hidden="true"
														className={`${
															togglePaymentPeriod
																? 'translate-x-6'
																: 'translate-x-0'
														} inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
													/>
												</span>
												<p
													className={`text-md leading-7 font-medium text-gray-500 mx-4`}
												>
													{SubscriptionLabel[2].label}
												</p>
											</div>

											<div className={`mt-10 mb-2`}>
												<p className={`text-center text-red-400`}>
													* credit/debit card required.
												</p>
											</div>
										</div>

										<div className={`mt-16 pb-12 lg:mt-20 lg:pb-20`}>
											<div className={`relative z-0`}>
												<div
													className={`absolute inset-0 h-5/6 lg:h-2/3`}
												></div>
												<div
													className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8`}
												>
													<div className={`relative lg:grid lg:grid-cols-7`}>
														{subscriptions.results
															.filter((result) => result.group.name === 'Basic')
															.map((val, key) => {
																return (
																	<div
																		key={key}
																		className={`mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3`}
																	>
																		<div
																			className={`h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg`}
																		>
																			<div className={`flex-1 flex flex-col`}>
																				<div className={`bg-white px-6 py-10`}>
																					<div>
																						<h3
																							className={`text-center text-2xl leading-8 font-medium text-gray-900" id="tier-hobby`}
																						>
																							{val.group.name}
																						</h3>
																						<div
																							className={`mt-4 flex items-center justify-center`}
																						>
																							<span
																								className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900`}
																							>
																								<span
																									className={`mt-2 mr-2 text-4xl font-medium`}
																								>
																									$
																								</span>
																								<span className={`font-bold`}>
																									{val.price.unit_amount / 100}
																								</span>
																							</span>
																							<span
																								className={`text-xl leading-7 font-medium text-gray-500`}
																							>
																								/month
																							</span>
																						</div>
																					</div>
																				</div>
																				<div
																					className={`flex-1 flex flex-col justify-between border-t-2 border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10`}
																				>
																					<ul>
																						{val.features.map((val2, key) => {
																							return (
																								<li
																									key={key}
																									className={`flex items-start my-3`}
																								>
																									<div
																										className={`flex-shrink-0`}
																									>
																										<svg
																											className={`h-6 w-6 text-green-500`}
																											stroke="currentColor"
																											fill="none"
																											viewBox="0 0 24 24"
																										>
																											<path
																												strokeLinecap="round"
																												strokeLinejoin="round"
																												strokeWidth="2"
																												d="M5 13l4 4L19 7"
																											/>
																										</svg>
																									</div>
																									<p
																										className={`ml-3 text-base leading-6 font-medium text-gray-500`}
																									>
																										{val2}
																									</p>
																								</li>
																							);
																						})}
																					</ul>
																					<div className={`mt-8`}>
																						<div
																							className={`rounded-lg ${
																								val.id === subscription.id ||
																								subscription.id === null
																									? 'shadow-none'
																									: 'shadow-md'
																							}`}
																						>
																							{val.id === subscription.id ||
																							subscription.id === null ? (
																								<button
																									className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed`}
																								>
																									{SubscriptionLabel[4].label}
																								</button>
																							) : (
																								<button
																									className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150`}
																									onClick={() =>
																										setTimeout(() => {
																											setShowChangeToBasicModal(
																												!showChangeToBasicModal
																											);
																											setBasicPlanId(val.id);
																											setBasicPlanName(
																												val.group.name
																											);
																											setLoadingBasic(true);
																										}, 150)
																									}
																								>
																									{loadingBasic
																										? 'Processing Plan...'
																										: SubscriptionLabel[3]
																												.label}
																								</button>
																							)}
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																);
															})}
														{togglePaymentPeriod
															? subscriptions.results
																	.filter(
																		(result) =>
																			result.price.recurring.interval_count ===
																			6
																	)
																	.map((val, key) => {
																		return val.group.name === 'Pro' ? (
																			<div
																				key={key}
																				className={`mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4`}
																			>
																				<div
																					className={`relative z-10 rounded-lg shadow-xl`}
																				>
																					<div
																						className={`pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600`}
																					></div>
																					<div
																						className={`absolute inset-x-0 top-0 transform translate-y-px`}
																					>
																						<div
																							className={`flex justify-center transform -translate-y-1/2`}
																						>
																							<span
																								className={`inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}
																							>
																								Most popular
																							</span>
																						</div>
																					</div>
																					<div
																						className={`bg-white rounded-t-lg px-6 pt-12 pb-10`}
																					>
																						<div>
																							<h3
																								className={`text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6" id="tier-growth`}
																							>
																								{val.group.name === 'Pro2'
																									? 'Pro'
																									: val.group.name}
																								<span
																									className={`text-red-400`}
																								>
																									*
																								</span>
																							</h3>
																							<div
																								className={`mt-4 flex items-center justify-center`}
																							>
																								<span
																									className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl`}
																								>
																									<span
																										className={`mt-2 mr-2 text-4xl font-medium`}
																									>
																										$
																									</span>
																									<span className={`font-bold`}>
																										{val.price.unit_amount /
																											100}
																									</span>
																								</span>
																								<span
																									className={`text-2xl leading-8 font-medium text-gray-500`}
																								>
																									/month
																								</span>
																							</div>
																						</div>
																					</div>
																					<div
																						className={`border-t-2 border-gray-300 rounded-b-lg pt-10 pb-8 px-6 bg-white sm:px-10 sm:py-10`}
																					>
																						<ul>
																							{val.features.map((val2, key) => {
																								return (
																									<li
																										key={key}
																										className={`flex items-start my-3`}
																									>
																										<div
																											className={`flex-shrink-0`}
																										>
																											<svg
																												className={`h-6 w-6 text-green-500`}
																												stroke="currentColor"
																												fill="none"
																												viewBox="0 0 24 24"
																											>
																												<path
																													strokeLinecap="round"
																													strokeLinejoin="round"
																													strokeWidth="2"
																													d="M5 13l4 4L19 7"
																												/>
																											</svg>
																										</div>
																										<p
																											className={`ml-3 text-base leading-6 font-medium text-gray-500`}
																										>
																											{val2}
																										</p>
																									</li>
																								);
																							})}
																						</ul>
																						<div className={`mt-10`}>
																							<div
																								className={`rounded-lg ${
																									val.id === subscription.id
																										? 'shadow-none'
																										: 'shadow-md'
																								}`}
																							>
																								{val.id === subscription.id ? (
																									<button
																										className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed`}
																									>
																										{SubscriptionLabel[4].label}
																									</button>
																								) : (
																									<button
																										type="button"
																										className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white ${
																											!paymentMethod ||
																											loadingProSemiAnnually
																												? 'opacity-50 cursor-not-allowed'
																												: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150'
																										}`}
																										disabled={
																											!paymentMethod ||
																											loadingProSemiAnnually
																												? 'disabled'
																												: ''
																										}
																										onClick={() => {
																											if (
																												currentPaymentMethod.id ==
																													undefined &&
																												subscription.id == null
																											) {
																												setTimeout(() => {
																													setUpdatedPlanId(
																														val.id
																													);
																													setUpdatedPlanName(
																														val.group.name
																													);
																													setShowModal(
																														!showModal
																													);
																												}, 150);
																											} else {
																												setTimeout(() => {
																													selectPlan(
																														val.id,
																														val.group.name
																													);
																												}, 150);
																											}
																										}}
																									>
																										{loadingProSemiAnnually
																											? 'Processing Payment...'
																											: SubscriptionLabel[3]
																													.label}
																									</button>
																								)}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		) : val.group.name === 'Agency' ? (
																			<div
																				key={key}
																				className={`mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3`}
																			>
																				<div
																					className={`h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg`}
																				>
																					<div
																						className={`flex-1 flex flex-col`}
																					>
																						<div
																							className={`bg-white px-6 py-10`}
																						>
																							<div>
																								<h3
																									className={`text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale`}
																								>
																									{val.group.name === 'Agency2'
																										? 'Agency'
																										: val.group.name}
																									<span
																										className={`text-red-400`}
																									>
																										*
																									</span>
																								</h3>
																								<div
																									className={`mt-4 flex items-center justify-center`}
																								>
																									<span
																										className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900`}
																									>
																										<span
																											className={`mt-2 mr-2 text-4xl font-medium`}
																										>
																											$
																										</span>
																										<span
																											className={`font-bold`}
																										>
																											{val.price.unit_amount /
																												100}
																										</span>
																									</span>
																									<span
																										className={`text-xl leading-7 font-medium text-gray-500`}
																									>
																										/month
																									</span>
																								</div>
																							</div>
																						</div>
																						<div
																							className={`flex-1 flex flex-col justify-between border-t-2 border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10`}
																						>
																							<ul>
																								{val.features.map(
																									(val2, key) => {
																										return (
																											<li
																												key={key}
																												className={`flex items-start my-3`}
																											>
																												<div
																													className={`flex-shrink-0`}
																												>
																													<svg
																														className={`h-6 w-6 text-green-500`}
																														stroke="currentColor"
																														fill="none"
																														viewBox="0 0 24 24"
																													>
																														<path
																															strokeLinecap="round"
																															strokeLinejoin="round"
																															strokeWidth="2"
																															d="M5 13l4 4L19 7"
																														/>
																													</svg>
																												</div>
																												<p
																													className={`ml-3 text-base leading-6 font-medium text-gray-500`}
																												>
																													{val2}
																												</p>
																											</li>
																										);
																									}
																								)}
																							</ul>
																							<div className={`mt-8`}>
																								<div
																									className={`rounded-lg ${
																										val.id === subscription.id
																											? 'shadow-none'
																											: 'shadow-md'
																									}`}
																								>
																									{val.id ===
																									subscription.id ? (
																										<button
																											className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed`}
																										>
																											{
																												SubscriptionLabel[4]
																													.label
																											}
																										</button>
																									) : (
																										<button
																											className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white ${
																												!paymentMethod ||
																												loadingAgencySemiAnnually
																													? 'opacity-50 cursor-not-allowed'
																													: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150'
																											}`}
																											disabled={
																												!paymentMethod ||
																												loadingAgencySemiAnnually
																													? 'disabled'
																													: ''
																											}
																											onClick={() => {
																												if (
																													currentPaymentMethod.id ==
																														undefined &&
																													subscription.id ==
																														null
																												) {
																													setTimeout(() => {
																														setUpdatedPlanId(
																															val.id
																														);
																														setUpdatedPlanName(
																															val.group.name
																														);
																														setShowModal(
																															!showModal
																														);
																													}, 150);
																												} else {
																													setTimeout(() => {
																														selectPlan(
																															val.id,
																															val.group.name
																														);
																													}, 150);
																												}
																											}}
																										>
																											{loadingAgencySemiAnnually
																												? 'Processing Payment...'
																												: SubscriptionLabel[3]
																														.label}
																										</button>
																									)}
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		) : null;
																	})
															: subscriptions.results
																	.filter(
																		(result) =>
																			result.price.recurring.interval_count ===
																			1
																	)
																	.map((val, key) => {
																		return val.group.name === 'Pro' ? (
																			<div
																				key={key}
																				className={`mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4`}
																			>
																				<div
																					className={`relative z-10 rounded-lg shadow-xl`}
																				>
																					<div
																						className={`pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600`}
																					></div>
																					<div
																						className={`absolute inset-x-0 top-0 transform translate-y-px`}
																					>
																						<div
																							className={`flex justify-center transform -translate-y-1/2`}
																						>
																							<span
																								className={`inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}
																							>
																								Most popular
																							</span>
																						</div>
																					</div>
																					<div
																						className={`bg-white rounded-t-lg px-6 pt-12 pb-10`}
																					>
																						<div>
																							<h3
																								className={`text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6" id="tier-growth`}
																							>
																								{val.group.name}
																								<span
																									className={`text-red-400`}
																								>
																									*
																								</span>
																							</h3>
																							<div
																								className={`mt-4 flex items-center justify-center`}
																							>
																								<span
																									className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl`}
																								>
																									<span
																										className={`mt-2 mr-2 text-4xl font-medium`}
																									>
																										$
																									</span>
																									<span className={`font-bold`}>
																										{val.price.unit_amount /
																											100}
																									</span>
																								</span>
																								<span
																									className={`text-2xl leading-8 font-medium text-gray-500`}
																								>
																									/month
																								</span>
																							</div>
																						</div>
																					</div>
																					<div
																						className={`border-t-2 border-gray-300 rounded-b-lg pt-10 pb-8 px-6 bg-white sm:px-10 sm:py-10`}
																					>
																						<ul>
																							{val.features.map((val2, key) => {
																								return (
																									<li
																										key={key}
																										className={`flex items-start my-3`}
																									>
																										<div
																											className={`flex-shrink-0`}
																										>
																											<svg
																												className={`h-6 w-6 text-green-500`}
																												stroke="currentColor"
																												fill="none"
																												viewBox="0 0 24 24"
																											>
																												<path
																													strokeLinecap="round"
																													strokeLinejoin="round"
																													strokeWidth="2"
																													d="M5 13l4 4L19 7"
																												/>
																											</svg>
																										</div>
																										<p
																											className={`ml-3 text-base leading-6 font-medium text-gray-500`}
																										>
																											{val2}
																										</p>
																									</li>
																								);
																							})}
																						</ul>
																						<div className={`mt-10`}>
																							<div
																								className={`rounded-lg ${
																									val.id === subscription.id
																										? 'shadow-none'
																										: 'shadow-md'
																								}`}
																							>
																								{val.id === subscription.id ? (
																									<button
																										className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed`}
																									>
																										{SubscriptionLabel[4].label}
																									</button>
																								) : (
																									<button
																										type="button"
																										className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white ${
																											!paymentMethod ||
																											loadingProMonthly
																												? 'opacity-50 cursor-not-allowed'
																												: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150'
																										}`}
																										disabled={
																											!paymentMethod ||
																											loadingProMonthly
																												? 'disabled'
																												: ''
																										}
																										onClick={() => {
																											if (
																												currentPaymentMethod.id ==
																													undefined &&
																												subscription.id == null
																											) {
																												setTimeout(() => {
																													setUpdatedPlanId(
																														val.id
																													);
																													setUpdatedPlanName(
																														val.group.name
																													);
																													setShowModal(
																														!showModal
																													);
																												}, 150);
																											} else {
																												setTimeout(() => {
																													selectPlan(
																														val.id,
																														val.group.name
																													);
																												}, 150);
																											}
																										}}
																									>
																										{loadingProMonthly
																											? 'Processing Payment...'
																											: SubscriptionLabel[3]
																													.label}
																									</button>
																								)}
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		) : val.group.name === 'Agency' ? (
																			<div
																				key={key}
																				className={`mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3`}
																			>
																				<div
																					className={`h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg`}
																				>
																					<div
																						className={`flex-1 flex flex-col`}
																					>
																						<div
																							className={`bg-white px-6 py-10`}
																						>
																							<div>
																								<h3
																									className={`text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale`}
																								>
																									{val.group.name}
																									<span
																										className={`text-red-400`}
																									>
																										*
																									</span>
																								</h3>
																								<div
																									className={`mt-4 flex items-center justify-center`}
																								>
																									<span
																										className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900`}
																									>
																										<span
																											className={`mt-2 mr-2 text-4xl font-medium`}
																										>
																											$
																										</span>
																										<span
																											className={`font-bold`}
																										>
																											{val.price.unit_amount /
																												100}
																										</span>
																									</span>
																									<span
																										className={`text-xl leading-7 font-medium text-gray-500`}
																									>
																										/month
																									</span>
																								</div>
																							</div>
																						</div>
																						<div
																							className={`flex-1 flex flex-col justify-between border-t-2 border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10`}
																						>
																							<ul>
																								{val.features.map(
																									(val2, key) => {
																										return (
																											<li
																												key={key}
																												className={`flex items-start my-3`}
																											>
																												<div
																													className={`flex-shrink-0`}
																												>
																													<svg
																														className={`h-6 w-6 text-green-500`}
																														stroke="currentColor"
																														fill="none"
																														viewBox="0 0 24 24"
																													>
																														<path
																															strokeLinecap="round"
																															strokeLinejoin="round"
																															strokeWidth="2"
																															d="M5 13l4 4L19 7"
																														/>
																													</svg>
																												</div>
																												<p
																													className={`ml-3 text-base leading-6 font-medium text-gray-500`}
																												>
																													{val2}
																												</p>
																											</li>
																										);
																									}
																								)}
																							</ul>
																							<div className={`mt-8`}>
																								<div
																									className={`rounded-lg ${
																										val.id === subscription.id
																											? 'shadow-none'
																											: 'shadow-md'
																									}`}
																								>
																									{val.id ===
																									subscription.id ? (
																										<button
																											className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed`}
																										>
																											{
																												SubscriptionLabel[4]
																													.label
																											}
																										</button>
																									) : (
																										<button
																											className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white ${
																												!paymentMethod ||
																												loadingAgencyMonthly
																													? 'opacity-50 cursor-not-allowed'
																													: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150'
																											}`}
																											disabled={
																												!paymentMethod ||
																												loadingAgencyMonthly
																													? 'disabled'
																													: ''
																											}
																											onClick={() => {
																												if (
																													currentPaymentMethod.id ==
																														undefined &&
																													subscription.id ==
																														null
																												) {
																													setTimeout(() => {
																														setUpdatedPlanId(
																															val.id
																														);
																														setUpdatedPlanName(
																															val.group.name
																														);
																														setShowModal(
																															!showModal
																														);
																													}, 150);
																												} else {
																													setTimeout(() => {
																														selectPlan(
																															val.id,
																															val.group.name
																														);
																													}, 150);
																												}
																											}}
																										>
																											{loadingAgencyMonthly
																												? 'Processing Payment...'
																												: SubscriptionLabel[3]
																														.label}
																										</button>
																									)}
																								</div>
																							</div>
																						</div>
																					</div>
																				</div>
																			</div>
																		) : null;
																	})}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div
									className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
								>
									<SiteFooter />
								</div>
							</main>
						</div>
					</SubscriptionsDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

export default Subscriptions;

Subscriptions.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string
};
