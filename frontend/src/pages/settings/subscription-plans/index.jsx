// React
import { useState, useEffect } from "react";

// NextJS
import Image from "next/image";
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { NextSeo } from "next-seo";
import { Transition } from "@headlessui/react";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import PaymentMethodFormLabel from "public/labels/components/form/PaymentMethodForm.json";
import SubscriptionLabel from "public/labels/pages/settings/subscriptions.json";

// Hooks
import {
	useStripePromise,
	useDefaultPaymentMethod,
	useSubscriptions,
	useDefaultSubscription
} from "src/hooks/useStripePromise";
import { useSite } from "src/hooks/useSite";
import usePostMethod from "src/hooks/usePostMethod";
import useDeleteMethod from "src/hooks/useDeleteMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const BasicPlan = loadable(() => import("src/components/pages/subscription/BasicPlan"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/buttons/MobileSidebarButton"));
const MonthlyPlans = loadable(() => import("src/components/pages/subscription/MonthlyPlans"));
const PaymentMethodForm = loadable(() => import("src/components/forms/PaymentMethodForm"));
const SemiAnnualPlans = loadable(() => import("src/components/pages/subscription/SemiAnnualPlans"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));

const ConfettiBgImgSpan = styled.span`
	background: url("/images/backgrounds/subscription-success-bg.png");
	background-size: cover;
	background-position: top center;
	background-repeat: no-repeat;
	min-height: 16rem;
	width: 100%;
	position: absolute;
	z-index: -1;
`;

const Subscriptions = ({ width }) => {
	const [basicPlanId, setBasicPlanId] = useState(0);
	const [basicPlanName, setBasicPlanName] = useState("");
	const [pageLoaded, setPageLoaded] = useState(false);
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState([]);
	const [currentSubscription, setCurrentSubscription] = useState([]);
	const [currentSubscriptions, setCurrentSubscriptions] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = useState(false);
	const [loadingBasic, setLoadingBasic] = useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [showChangeToBasicModal, setShowChangeToBasicModal] = useState(false);
	const [showPaymentFormModal, setShowPaymentFormModal] = useState(false);
	const [showNewActivePlanModal, setShowNewActivePlanModal] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [stripePromiseData, setStripePromiseData] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);
	const [togglePaymentPeriod, setTogglePaymentPeriod] = useState(false);
	const [updatedPlanId, setUpdatedPlanId] = useState(0);
	const [updatedPlanName, setUpdatedPlanName] = useState("");
	const [userData, setUserData] = useState([]);

	const currentSubscriptionApiEndpoint = "/api/stripe/subscription/current/";
	const currentPaymentMethodApiEndpoint = "/api/stripe/payment-method/";
	const homeLabel = "Home";
	const homePageLink = "/sites";
	const pageTitle = "Subscriptions";
	const siteApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { site: site } = useSite({
		endpoint: siteApiEndpoint
	});

	const { stripePromise: stripePromise } = useStripePromise();

	const { defaultPaymentMethod: defaultPaymentMethod } = useDefaultPaymentMethod({});

	const { subscriptions: subscriptions } = useSubscriptions({});

	const { defaultSubscription: defaultSubscription, mutateDefaultSubscription: mutateDefaultSubscription } =
		useDefaultSubscription({});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			stripePromise &&
			stripePromise !== [] &&
			Object.keys(stripePromise).length > 0 &&
			defaultPaymentMethod &&
			defaultPaymentMethod !== [] &&
			Object.keys(defaultPaymentMethod).length > 0 &&
			subscriptions &&
			subscriptions !== undefined &&
			Object.keys(subscriptions).length > 0 &&
			defaultSubscription &&
			defaultSubscription !== undefined &&
			Object.keys(defaultSubscription).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);

			setUserData(user);
			setSiteData(site);
			setStripePromiseData(stripePromise.publishable_key);
			setCurrentPaymentMethod(defaultPaymentMethod);
			setCurrentSubscriptions(subscriptions);
			setCurrentSubscription(defaultSubscription);
		}
	}, [user, site, stripePromise, defaultPaymentMethod, subscriptions, defaultSubscription]);

	const handleSelectPlan = async (id, name, selectedPaymentMethod) => {
		try {
			if (name === "Basic") {
				const response = await useDeleteMethod(currentSubscriptionApiEndpoint);
				const data = await response.data;

				console.log(response);

				if (Math.floor(response.status / 200) === 1) {
					if (data) {
						if (data.status === "PAID") {
							mutateDefaultSubscription().then((info) => {
								if (info.id === null) {
									setLoadingProMonthly(false);
									setLoadingAgencyMonthly(false);
									setLoadingProSemiAnnually(false);
									setLoadingAgencySemiAnnually(false);
									setShowChangeToBasicModal(!showChangeToBasicModal);
								}
							});
						} else {
							// FIXME: update script to run when data.status !== "PAID"
							console.log(data.status);
						}
					}
				} else {
					if (data) {
						console.log(data);
					}
				}

				return false;
			}

			if (
				selectedPaymentMethod &&
				selectedPaymentMethod !== undefined &&
				Object.keys(selectedPaymentMethod).length > 0
			) {
				try {
					const body = {
						id: selectedPaymentMethod
					};

					setLoading(true);

					const response = await usePostMethod(currentPaymentMethodApiEndpoint, body);
					const data = await response.data;

					if (Math.floor(response.status / 200) === 1) {
						if (data) {
							currentSubscriptions.results
								.filter((sub) => sub.id === id)
								.map((val) => {
									if (
										val.group.name === "Pro" &&
										val.price.recurring.interval === "month" &&
										val.price.recurring.interval_count === 1
									) {
										setLoadingBasic(false);
										setLoadingProMonthly(true);
										setLoadingAgencyMonthly(false);
										setLoadingProSemiAnnually(false);
										setLoadingAgencySemiAnnually(false);
									} else if (
										val.group.name === "Agency" &&
										val.price.recurring.interval === "month" &&
										val.price.recurring.interval_count === 1
									) {
										setLoadingBasic(false);
										setLoadingProMonthly(false);
										setLoadingAgencyMonthly(true);
										setLoadingProSemiAnnually(false);
										setLoadingAgencySemiAnnually(false);
									} else if (
										val.group.name === "Pro" &&
										val.price.recurring.interval === "month" &&
										val.price.recurring.interval_count === 6
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
						}
					} else {
						if (data) {
							console.log(data);
						}
					}
				} catch (error) {
					throw error.message;
				}
			}
		} catch (error) {
			throw error.message;
		}
	};

	const handleSubscriptionUpdate = async (subId) => {
		try {
			const body = {
				id: subId
			};

			const response = await usePostMethod(currentSubscriptionApiEndpoint, body);
			const data = await response.data;

			if (Math.floor(response.status / 200) === 1) {
				if (data) {
					setTimeout(() => {
						mutateDefaultSubscription().then((info) => {
							if (info.status === "PAID") {
								subscriptions.results
									.filter((sub) => sub.id === info.id)
									.map((val) => {
										setUpdatedPlanName(val.group.name);
										setUpdatedPlanId(val.id);
									});
								setLoading(false);

								if (!loading) {
									setTimeout(() => {
										setShowPaymentFormModal(false);
									}, 500);
								}

								if (showPaymentFormModal) {
									setTimeout(() => {
										setShowNewActivePlanModal(true);
									}, 1000);
								}
							} else if (info.status === "WAITING_PAYMENT") {
								handleSubscriptionUpdate(subId);
							}
						});
					}, 2000);
				}
			} else {
				if (data) {
					console.log(data);
				}
			}
		} catch (error) {
			throw error.message;
		}
	};

	const handleCurrentPaymentPeriod = (sub, subs) => {
		let intervalCount = "";

		if (
			sub &&
			sub !== undefined &&
			Object.keys(sub).length > 0 &&
			subs &&
			subs !== undefined &&
			Object.keys(subs).length > 0
		) {
			subs.results &&
				subs.results !== undefined &&
				Object.keys(subs).length > 0 &&
				subs.results
					.filter((result) => result.id === sub.id)
					.map((val, key) => {
						intervalCount = val.price.recurring.interval_count;
					});
		}

		return intervalCount;
	};

	useEffect(() => {
		if (handleCurrentPaymentPeriod(currentSubscription, currentSubscriptions) > 1) {
			setTogglePaymentPeriod(true);
		} else {
			setTogglePaymentPeriod(false);
		}
	}, [currentSubscription, currentSubscriptions]);

	return pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<Transition show={showNewActivePlanModal} tw="fixed z-50 inset-0 overflow-y-auto">
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div tw="fixed inset-0 transition-opacity">
							<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
					</Transition.Child>
					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
					&#8203;
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						tw="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6 lg:p-0"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<ConfettiBgImgSpan />
						<div tw="hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-50">
							<button
								type="button"
								tw="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
								aria-label="Close"
								onClick={() =>
									setTimeout(() => {
										setShowNewActivePlanModal(!showNewActivePlanModal);
									}, 150)
								}
							>
								<svg tw="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div>
							<img
								src="/images/backgrounds/subscription-success-badge.png"
								alt="badge-modal-img"
								tw="mx-auto mt-16 mb-6"
							/>
							<div tw="text-center sm:mt-3">
								<h2 tw="mb-3 text-3xl leading-6 font-bold text-gray-900" id="modal-headline">
									{SubscriptionLabel[13].label}
								</h2>
								<p tw="mb-6 text-base leading-6 font-semibold">Your {updatedPlanName} plan is now active.</p>
								{currentSubscriptions &&
									currentSubscriptions.results &&
									currentSubscriptions.results !== undefined &&
									Object.keys(currentSubscriptions.results).length > 0 &&
									currentSubscriptions.results
										.filter((result) => result.id === updatedPlanId)
										.map((val, key) => {
											return (
												<div
													key={key}
													tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3"
												>
													<div tw="h-full flex flex-col">
														<div tw="flex-1 flex flex-col">
															<div tw="flex-1 flex flex-col justify-between p-6 bg-white sm:p-10 lg:p-6 xl:p-6">
																<ul tw="grid grid-cols-2">
																	{val.features.map((val2, key) => {
																		return (
																			<li key={key} tw="flex items-start my-1">
																				<div tw="flex-shrink-0">
																					<svg
																						tw="h-6 w-6 text-green-500"
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
																				<p tw="ml-3 text-sm leading-6 font-medium text-gray-500">{val2}</p>
																			</li>
																		);
																	})}
																</ul>
																<hr tw="my-6 border-b border-gray-300" />
																<button
																	type="button"
																	tw="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																	aria-label="Start Crawling"
																	onClick={() =>
																		setTimeout(() => {
																			setShowNewActivePlanModal(!showNewActivePlanModal);
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
			</Transition>

			<Transition show={showPaymentFormModal} tw="fixed z-50 inset-0 overflow-y-auto">
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						tw="fixed inset-0 transition-opacity"
					>
						<div aria-hidden="true">
							<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
					</Transition.Child>

					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
					>
						<div role="dialog" aria-modal="true" aria-labelledby="modal-headline">
							<div tw="w-full text-center mt-5 sm:rounded-lg inline-block">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">{SubscriptionLabel[7].label}</h3>
								<p tw="mt-2 text-sm text-gray-500">{SubscriptionLabel[7].description}</p>
								<div tw="mt-8 mb-3 max-w-full lg:max-w-3xl">
									<Elements stripe={loadStripe(stripePromiseData)}>
										<PaymentMethodForm
											loading={loading}
											setLoading={setLoading}
											successMsg={successMsg}
											setSuccessMsg={setSuccessMsg}
											successMsgLoaded={successMsgLoaded}
											setSuccessMsgLoaded={setSuccessMsgLoaded}
											errorMsg={errorMsg}
											setErrorMsg={setErrorMsg}
											errorMsgLoaded={errorMsgLoaded}
											setErrorMsgLoaded={setErrorMsgLoaded}
											showPaymentFormModal={showPaymentFormModal}
											setShowPaymentFormModal={setShowPaymentFormModal}
											updatedPlanId={updatedPlanId}
											updatedPlanName={updatedPlanName}
											handleSelectPlan={handleSelectPlan}
										/>
									</Elements>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex  lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									className={tw`mt-4 mx-auto h-8 w-auto`}
									src="/images/logos/site-logo-dark.svg"
									alt="app-logo"
								/>
							</a>
						</Link>
					</div>

					<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="max-w-full px-4 py-4 sm:px-6 md:px-8">
							<div tw="w-full mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12 min-h-screen">
								<div tw="lg:col-span-3 xl:col-span-3 xl:pr-8">
									<div className="max-w-full py-4 px-8">
										<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
											<ol tw="flex items-center space-x-4">
												<li>
													<div>
														{pageLoaded ? (
															<Link href={homePageLink} passHref>
																<a tw="text-gray-400 hover:text-gray-500">
																	<HomeIcon tw="flex-shrink-0 h-5 w-5" />
																	<span tw="sr-only">{homeLabel}</span>
																</a>
															</Link>
														) : (
															<Skeleton duration={2} width={40} height={20} />
														)}
													</div>
												</li>
												<li>
													<div tw="flex items-center">
														{pageLoaded ? (
															<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														) : (
															<Skeleton duration={2} width={20} height={20} />
														)}

														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageLoaded ? pageTitle : <Skeleton duration={2} width={100} height={20} />}
														</p>
													</div>
												</li>
											</ol>
										</nav>
										<div className="pt-4 m-auto">
											<h4 className="text-2xl leading-6 font-medium text-gray-900">
												{pageLoaded ? SubscriptionLabel[20].label : <Skeleton duration={2} width={150} height={35} />}
											</h4>
										</div>
									</div>
									<div tw="max-w-full py-4 px-8">
										<div tw="flex items-center flex-col flex-wrap pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
											<div tw="text-center mb-10">
												<p tw="text-2xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
													{pageLoaded ? SubscriptionLabel[0].label : <Skeleton duration={2} width={200} height={35} />}
												</p>
												<p tw="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
													{pageLoaded ? (
														SubscriptionLabel[0].description
													) : (
														<Skeleton duration={2} width={300} height={25} />
													)}
												</p>
											</div>

											<div tw="flex items-center justify-center">
												<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
													{pageLoaded ? SubscriptionLabel[1].label : <Skeleton duration={2} width={100} height={20} />}
												</p>
												{pageLoaded ? (
													<span
														role="checkbox"
														tabIndex="0"
														onClick={() => setTogglePaymentPeriod(!togglePaymentPeriod)}
														aria-checked={togglePaymentPeriod}
														css={[
															tw`relative inline-flex items-center flex-shrink-0 h-6 w-12 mx-auto border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring`,
															togglePaymentPeriod ? tw`bg-indigo-600` : tw`bg-gray-200`
														]}
													>
														<span
															aria-hidden="true"
															css={[
																tw`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`,
																togglePaymentPeriod ? tw`translate-x-6` : tw`translate-x-0`
															]}
														/>
													</span>
												) : (
													<Skeleton duration={2} width={50} height={20} />
												)}

												<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
													{pageLoaded ? SubscriptionLabel[2].label : <Skeleton duration={2} width={100} height={20} />}
												</p>
											</div>

											<div tw="mt-10 mb-2">
												<p tw="text-center text-red-400">
													{pageLoaded ? SubscriptionLabel[23].label : <Skeleton duration={2} width={200} height={20} />}
												</p>
											</div>
										</div>

										<div tw="mt-16 pb-12 lg:mt-20 lg:pb-20">
											<div tw="relative z-0">
												<div tw="absolute inset-0 h-5/6 lg:h-2/3"></div>
												<div tw="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
													<div tw="relative lg:grid lg:grid-cols-7">
														{pageLoaded ? (
															<>
																{currentSubscriptions &&
																	currentSubscriptions.results &&
																	currentSubscriptions.results !== undefined &&
																	Object.keys(currentSubscriptions.results).length > 0 &&
																	currentSubscriptions.results
																		.filter((result) => result.group.name === "Basic")
																		.map((val, key) => (
																			<BasicPlan
																				key={key}
																				data={val}
																				currentSubscription={currentSubscription}
																				currentPaymentMethod={currentPaymentMethod}
																				subscriptionLabel={SubscriptionLabel}
																				paymentMethodFormLabel={PaymentMethodFormLabel}
																				showChangeToBasicModal={showChangeToBasicModal}
																				setShowChangeToBasicModal={setShowChangeToBasicModal}
																				basicPlanId={basicPlanId}
																				setBasicPlanId={setBasicPlanId}
																				basicPlanName={basicPlanName}
																				setBasicPlanName={setBasicPlanName}
																				loadingBasic={loadingBasic}
																				setLoadingBasic={setLoadingBasic}
																				successMsg={successMsg}
																				successMsgLoaded={successMsgLoaded}
																				setSuccessMsgLoaded={setSuccessMsgLoaded}
																				errorMsg={errorMsg}
																				errorMsgLoaded={errorMsgLoaded}
																				setErrorMsgLoaded={setErrorMsgLoaded}
																				handleSelectPlan={handleSelectPlan}
																			/>
																		))}
																{togglePaymentPeriod
																	? subscriptions.results
																			.filter((result) => result.price.recurring.interval_count === 6)
																			.map((val, key) => (
																				<SemiAnnualPlans
																					key={key}
																					data={val}
																					currentSubscription={currentSubscription}
																					subscriptionLabel={SubscriptionLabel}
																					currentPaymentMethod={currentPaymentMethod}
																					loadingProSemiAnnually={loadingProSemiAnnually}
																					loadingAgencySemiAnnually={loadingAgencySemiAnnually}
																					setUpdatedPlanId={setUpdatedPlanId}
																					setUpdatedPlanName={setUpdatedPlanName}
																					showPaymentFormModal={showPaymentFormModal}
																					setShowPaymentFormModal={setShowPaymentFormModal}
																				/>
																			))
																	: currentSubscriptions &&
																	  currentSubscriptions.results &&
																	  currentSubscriptions.results !== undefined &&
																	  Object.keys(currentSubscriptions.results).length > 0 &&
																	  currentSubscriptions.results
																			.filter((result) => result.price.recurring.interval_count === 1)
																			.map((val, key) => (
																				<MonthlyPlans
																					key={key}
																					data={val}
																					currentSubscription={currentSubscription}
																					subscriptionLabel={SubscriptionLabel}
																					currentPaymentMethod={currentPaymentMethod}
																					loadingProMonthly={loadingProMonthly}
																					loadingAgencyMonthly={loadingAgencyMonthly}
																					setUpdatedPlanId={setUpdatedPlanId}
																					setUpdatedPlanName={setUpdatedPlanName}
																					showPaymentFormModal={showPaymentFormModal}
																					setShowPaymentFormModal={setShowPaymentFormModal}
																				/>
																			))}
															</>
														) : (
															<>
																<span tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
																	<Skeleton duration={2} width={347.41} height={553} />
																</span>
																<span tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
																	<Skeleton duration={2} width={521.11} height={811} />
																</span>
																<span tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
																	<Skeleton duration={2} width={347.41} height={553} />
																</span>
															</>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	) : (
		<Loader />
	);
};

Subscriptions.propTypes = {};

export default withResizeDetector(Subscriptions);
