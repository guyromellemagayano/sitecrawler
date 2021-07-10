// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

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
import usePostMethod from "src/hooks/usePostMethod";
import useDeleteMethod from "src/hooks/useDeleteMethod";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const BasicPlan = loadable(() => import("src/components/pages/subscription/BasicPlan"));
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MonthlyPlans = loadable(() => import("src/components/pages/subscription/MonthlyPlans"));
const NewActivePlanModal = loadable(() => import("src/components/modals/NewActivePlanModal"));
const PaymentMethodFormModal = loadable(() => import("src/components/modals/PaymentMethodFormModal"));
const SemiAnnualPlans = loadable(() => import("src/components/pages/subscription/SemiAnnualPlans"));

const Subscriptions = (props) => {
	const [basicPlanId, setBasicPlanId] = React.useState(0);
	const [basicPlanName, setBasicPlanName] = React.useState("");
	const [componentReady, setComponentReady] = React.useState(false);
	const [currentPaymentMethod, setCurrentPaymentMethod] = React.useState([]);
	const [currentSubscription, setCurrentSubscription] = React.useState([]);
	const [currentSubscriptions, setCurrentSubscriptions] = React.useState([]);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = React.useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = React.useState(false);
	const [loadingBasic, setLoadingBasic] = React.useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = React.useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);
	const [showChangeToBasicModal, setShowChangeToBasicModal] = React.useState(false);
	const [showNewActivePlanModal, setShowNewActivePlanModal] = React.useState(false);
	const [showPaymentFormModal, setShowPaymentFormModal] = React.useState(false);
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);
	const [togglePaymentPeriod, setTogglePaymentPeriod] = React.useState(false);
	const [updatedPlanId, setUpdatedPlanId] = React.useState(0);
	const [updatedPlanName, setUpdatedPlanName] = React.useState("");

	const appLogoAltText = "app-logo";
	const currentSubscriptionApiEndpoint = "/api/stripe/subscription/current/";
	const currentPaymentMethodApiEndpoint = "/api/stripe/payment-method/";
	const homePageLink = "/sites";
	const pageTitle = "Subscriptions";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { stripePromise } = useStripePromise({});
	const { defaultPaymentMethod } = useDefaultPaymentMethod({});
	const { subscriptions } = useSubscriptions({});
	const { defaultSubscription, mutateDefaultSubscription } = useDefaultSubscription({});

	React.useEffect(() => {
		user && stripePromise && defaultPaymentMethod && subscriptions && defaultSubscription
			? (() => {
					setComponentReady(true);
					setCurrentPaymentMethod(defaultPaymentMethod);
					setCurrentSubscriptions(subscriptions);
					setCurrentSubscription(defaultSubscription);
			  })()
			: setComponentReady(false);

		return { user, stripePromise, defaultPaymentMethod, subscriptions, defaultSubscription };
	}, [user, stripePromise, defaultPaymentMethod, subscriptions, defaultSubscription]);

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

	React.useEffect(() => {
		if (handleCurrentPaymentPeriod(currentSubscription, currentSubscriptions) > 1) {
			setTogglePaymentPeriod(true);
		} else {
			setTogglePaymentPeriod(false);
		}
	}, [currentSubscription, currentSubscriptions]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={props.width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<>
						<NewActivePlanModal
							showModal={showNewActivePlanModal}
							setShowModal={setShowNewActivePlanModal}
							updatedPlanId={updatedPlanId}
							updatedPlanName={updatedPlanName}
							currentSubscriptions={currentSubscriptions}
						/>
						<PaymentMethodFormModal
							showModal={showPaymentFormModal}
							setShowModal={setShowPaymentFormModal}
							loading={loading}
							setLoading={setLoading}
							successMsgLoaded={successMsgLoaded}
							setSuccessMsgLoaded={setSuccessMsgLoaded}
							updatedPlanId={updatedPlanId}
							updatedPlanName={updatedPlanName}
							handleSelectPlan={handleSelectPlan}
							stripePublishableKey={stripePromise?.publishable_key}
						/>

						<div tw="flex flex-col w-0 flex-1 overflow-hidden">
							<div tw="relative flex-shrink-0 flex">
								<div tw="border-b flex-shrink-0 flex">
									<MobileSidebarButton
										openMobileSidebar={openMobileSidebar}
										setOpenMobileSidebar={setOpenMobileSidebar}
									/>
								</div>

								<Link href={homePageLink} passHref>
									<a tw="p-1 block w-full cursor-pointer lg:hidden">
										<AppLogo
											tw="w-48 h-auto"
											src="/images/logos/site-logo-dark.svg"
											alt={appLogoAltText}
											width={230}
											height={40}
										/>
									</a>
								</Link>
							</div>

							<Scrollbars universal>
								<main tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
									<div tw="max-w-full p-4 sm:px-6 md:px-8">
										<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
											<div tw="lg:col-span-3 xl:col-span-3 xl:pr-8">
												<div tw="max-w-full p-4">
													<Breadcrumbs isOther pageTitle={pageTitle} />

													<div tw="pt-4 m-auto">
														<h2 tw="text-2xl text-center font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
															{pageTitle}
														</h2>
													</div>
												</div>

												<div tw="max-w-full py-4 px-8">
													<div tw="flex items-center flex-col flex-wrap pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
														<div tw="text-center mb-10">
															<p tw="text-xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
																{SubscriptionLabel[0].label}
															</p>
															<p tw="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
																{SubscriptionLabel[0].description}
															</p>
														</div>

														<div tw="flex items-center justify-center">
															<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
																{SubscriptionLabel[1].label}
															</p>

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

															<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
																{SubscriptionLabel[2].label}
															</p>
														</div>

														<div tw="mt-10 mb-2">
															<p tw="text-center text-red-400">{SubscriptionLabel[23].label}</p>
														</div>
													</div>

													<div tw="mt-16 pb-12 lg:mt-20 lg:pb-20">
														<div tw="relative z-0">
															<div tw="absolute inset-0 h-5/6 lg:h-2/3"></div>
															<div tw="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
																<div tw="relative lg:grid lg:grid-cols-7">
																	{componentReady ? (
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

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
										<SiteFooter />
									</div>
								</main>
							</Scrollbars>
						</div>
					</>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
	);
};

Subscriptions.propTypes = {};

export default withResizeDetector(Subscriptions);
