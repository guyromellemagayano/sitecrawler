import Breadcrumbs from "@components/breadcrumbs";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import { Layout } from "@components/layouts";
import Footer from "@components/layouts/Footer";
import Sidebar from "@components/layouts/Sidebar";
import { AppLogo } from "@components/logos/AppLogo";
import ChangeToBasicModal from "@components/modals/ChangeToBasicModal";
import NewActivePlanModal from "@components/modals/NewActivePlanModal";
import PaymentMethodModal from "@components/modals/PaymentMethodModal";
import BasicPlan from "@components/plans/BasicPlan";
import MonthlyPlans from "@components/plans/MonthlyPlans";
import SemiAnnualPlans from "@components/plans/SemiAnnualPlans";
import { CurrentPaymentMethodApiEndpoint, CurrentSubscriptionApiEndpoint, UserApiEndpoint } from "@enums/ApiEndpoints";
import { GlobalLabels, MutateInterval, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import { SubscriptionLabels } from "@enums/SubscriptionLabels";
import {
	useChangeToBasicPlanModalVisible,
	useComponentVisible,
	useNewActivePlanModalVisible,
	usePaymentMethodModalVisible
} from "@hooks/useComponentVisible";
import { useDeleteMethod, usePostMethod } from "@hooks/useHttpMethod";
import {
	useDefaultPaymentMethod,
	useDefaultSubscription,
	useStripePromise,
	useSubscriptions
} from "@hooks/useStripePromise";
import useUser from "@hooks/useUser";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

const SubscriptionPlans = () => {
	const [basicPlanId, setBasicPlanId] = useState(0);
	const [basicPlanName, setBasicPlanName] = useState("");
	const [componentReady, setComponentReady] = useState(false);
	const [disableDowngradeToBasicPlan, setDisableDowngradeToBasicPlan] = useState(false);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [errorMsg, setErrorMsg] = useState([]);
	const [hideButtons, setHideButtons] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = useState(false);
	const [successMsg, setSuccessMsg] = useState([]);
	const [togglePaymentPeriod, setTogglePaymentPeriod] = useState(false);
	const [updatedPlanId, setUpdatedPlanId] = useState(0);
	const [updatedPlanName, setUpdatedPlanName] = useState("");

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const { newActivePlanModalRef, isNewActivePlanModalVisible, setIsNewActivePlanModalVisible } =
		useNewActivePlanModalVisible(false);
	const { changeToBasicPlanModalRef, isChangeToBasicPlanModalVisible, setIsChangeToBasicPlanModalVisible } =
		useChangeToBasicPlanModalVisible(false);
	const { paymentMethodModalRef, isPaymentMethodModalVisible, setIsPaymentMethodModalVisible } =
		usePaymentMethodModalVisible(false);

	const { user, mutateUser } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});
	const { stripePromise } = useStripePromise({});
	const { defaultPaymentMethod } = useDefaultPaymentMethod({});
	const { subscriptions } = useSubscriptions({});
	const { defaultSubscription, mutateDefaultSubscription } = useDefaultSubscription({});

	useEffect(() => {
		user && stripePromise && defaultPaymentMethod && subscriptions && defaultSubscription
			? (() => {
					user?.settings?.disableLocalTime ? setDisableLocalTime(true) : setDisableLocalTime(false);

					setComponentReady(true);
			  })()
			: setComponentReady(false);

		return { user, stripePromise, defaultPaymentMethod, subscriptions, defaultSubscription };
	}, [user, stripePromise, defaultPaymentMethod, subscriptions, defaultSubscription]);

	const handleSelectPlan = (id, name, selectedPaymentMethod) => {
		name === "Basic"
			? (async () => {
					setDisableDowngradeToBasicPlan(true);

					const response = await useDeleteMethod(CurrentSubscriptionApiEndpoint);

					return Math.floor(response?.status / 200) === 1
						? response?.data?.status == "PAID"
							? mutateDefaultSubscription(CurrentSubscriptionApiEndpoint).then((info) => {
									info?.cancel_at !== null
										? (() => {
												setDisableDowngradeToBasicPlan(false);
												setLoadingProMonthly(false);
												setLoadingAgencyMonthly(false);
												setLoadingProSemiAnnually(false);
												setLoadingAgencySemiAnnually(false);
												setSuccessMsg((successMsg) => [...successMsg, SubscriptionLabels[24]]);
												mutateUser(UserApiEndpoint);
										  })()
										: (() => {
												setDisableDowngradeToBasicPlan(false);
												setErrorMsg((errorMsg) => [...errorMsg, SubscriptionLabels[19]]);
										  })();
							  })
							: (() => {
									setDisableDowngradeToBasicPlan(false);
									setErrorMsg((errorMsg) => [...errorMsg, SubscriptionLabels[19]]);
							  })()
						: (() => {
								setDisableDowngradeToBasicPlan(false);
								setErrorMsg((errorMsg) => [...errorMsg, SubscriptionLabels[19]]);
						  })();
			  })()
			: selectedPaymentMethod
			? (async () => {
					const body = {
						id: selectedPaymentMethod
					};

					setLoading(true);

					const response = await usePostMethod(CurrentPaymentMethodApiEndpoint, body);

					return Math.floor(response?.status / 200) === 1
						? response?.data
							? subscriptions?.results
									.filter((sub) => sub.id == id)
									.map((value) => {
										value?.plan?.name == "Pro" &&
										value?.price?.recurring?.interval == "month" &&
										value?.price?.recurring?.interval_count == 1
											? (() => {
													setLoadingProMonthly(true);
													setLoadingAgencyMonthly(false);
													setLoadingProSemiAnnually(false);
													setLoadingAgencySemiAnnually(false);
											  })()
											: value?.plan?.name == "Agency" &&
											  value?.price?.recurring?.interval == "month" &&
											  value?.price?.recurring?.interval_count == 1
											? (() => {
													setLoadingProMonthly(false);
													setLoadingAgencyMonthly(true);
													setLoadingProSemiAnnually(false);
													setLoadingAgencySemiAnnually(false);
											  })()
											: value?.plan?.name == "Pro" &&
											  value?.price?.recurring?.interval == "month" &&
											  value?.price?.recurring?.interval_count == 6
											? (() => {
													setLoadingProMonthly(false);
													setLoadingAgencyMonthly(false);
													setLoadingProSemiAnnually(true);
													setLoadingAgencySemiAnnually(false);
											  })()
											: (() => {
													setLoadingProMonthly(false);
													setLoadingAgencyMonthly(false);
													setLoadingProSemiAnnually(false);
													setLoadingAgencySemiAnnually(true);
											  })();

										handleSubscriptionUpdate(id);
									})
							: (() => {
									setLoading(false);
									setErrorMsg((errorMsg) => [...errorMsg, SubscriptionLabels[19]]);
							  })()
						: (() => {
								setLoading(false);
								setErrorMsg((errorMsg) => [...errorMsg, SubscriptionLabels[19]]);
						  })();
			  })()
			: null;
	};

	const handleSubscriptionUpdate = async (subId) => {
		const body = {
			id: subId
		};

		const response = await usePostMethod(CurrentSubscriptionApiEndpoint, body);

		return Math.floor(response?.status / 200) === 1
			? response?.data
				? setTimeout(() => {
						mutateDefaultSubscription().then((info) => {
							info?.status == "PAID"
								? (() => {
										subscriptions?.results
											.filter((sub) => sub.id === info.id)
											.map((val) => {
												setUpdatedPlanName(val?.plan?.name);
												setUpdatedPlanId(val?.id);
											});

										setLoading(false);

										!loading &&
											setTimeout(() => {
												setIsPaymentMethodModalVisible(false);
											}, 500);

										isPaymentMethodModalVisible &&
											setTimeout(() => {
												setIsNewActivePlanModalVisible(true);
											}, 1000);
								  })()
								: info?.status == "WAITING_PAYMENT"
								? handleSubscriptionUpdate(subId)
								: null;
						});
				  }, MutateInterval)
				: (() => {
						setLoading(false);
						setIsPaymentMethodModalVisible(false);
				  })()
			: (() => {
					setLoading(false);
					setIsPaymentMethodModalVisible(false);
			  })();
	};

	const handleCurrentPaymentPeriod = (sub, subs) => {
		let intervalCount = "";

		sub && subs
			? subs?.results
				? subs?.results
						.filter((result) => result.id === sub.id)
						.map((val) => {
							intervalCount = val?.price?.recurring.interval_count;
						})
				: null
			: null;

		return intervalCount;
	};

	useEffect(() => {
		Object.keys(successMsg).length > 0 ? setHideButtons(true) : setHideButtons(false);
	}, [successMsg]);

	useEffect(() => {
		handleCurrentPaymentPeriod(defaultSubscription, subscriptions) > 1
			? setTogglePaymentPeriod(true)
			: setTogglePaymentPeriod(false);
	}, [defaultSubscription, subscriptions]);

	return (
		<Layout user={user}>
			<NextSeo title={SubscriptionLabels[25].label} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar ref={ref} user={user} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

				<PaymentMethodModal
					handleSelectPlan={handleSelectPlan}
					loading={loading}
					mutateUser={mutateUser}
					ref={paymentMethodModalRef}
					setLoading={setLoading}
					setShowModal={setIsPaymentMethodModalVisible}
					showModal={isPaymentMethodModalVisible}
					stripePublishableKey={stripePromise?.publishable_key}
					updatedPlanId={updatedPlanId}
					updatedPlanName={updatedPlanName}
					userApiEndpoint={UserApiEndpoint}
				/>

				<NewActivePlanModal
					ref={newActivePlanModalRef}
					setErrorMsg={setErrorMsg}
					setShowModal={setIsNewActivePlanModalVisible}
					setSuccessMsg={setSuccessMsg}
					showModal={isNewActivePlanModalVisible}
					subscriptions={subscriptions}
					updatedPlanId={updatedPlanId}
					updatedPlanName={updatedPlanName}
					userApiEndpoint={UserApiEndpoint}
				/>

				<ChangeToBasicModal
					basicPlanId={basicPlanId}
					basicPlanName={basicPlanName}
					defaultPaymentMethod={defaultPaymentMethod}
					defaultSubscription={defaultSubscription}
					disableDowngradeToBasicPlan={disableDowngradeToBasicPlan}
					disableLocalTime={disableLocalTime}
					errorMsg={errorMsg}
					handleSelectPlan={handleSelectPlan}
					hideButtons={hideButtons}
					ref={changeToBasicPlanModalRef}
					setErrorMsg={setErrorMsg}
					setShowModal={setIsChangeToBasicPlanModalVisible}
					setSuccessMsg={setSuccessMsg}
					showModal={isChangeToBasicPlanModalVisible}
					successMsg={successMsg}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						<Link href={SitesLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									tw="w-48 h-auto"
									src={SiteLogoDark}
									alt={GlobalLabels[0].label}
									width={GlobalLabels[0].width}
									height={GlobalLabels[0].height}
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
											<Breadcrumbs isOther pageTitle={SubscriptionLabels[25].label} />

											<div tw="pt-4 m-auto">
												<h2 tw="text-2xl text-center font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
													{SubscriptionLabels[25].label}
												</h2>
											</div>
										</div>

										<div tw="max-w-full py-4 px-8">
											{/* TODO: Develop a seperate component, BillCheckbox */}
											<div tw="flex items-center flex-col flex-wrap pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
												<div tw="text-center mb-10">
													<p tw="text-xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
														{SubscriptionLabels[0].label}
													</p>
													<p tw="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
														{SubscriptionLabels[0].description}
													</p>
												</div>

												<div tw="flex items-center justify-center">
													<p tw="text-base leading-7 font-medium text-gray-500 mx-4">{SubscriptionLabels[1].label}</p>

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

													<p tw="text-base leading-7 font-medium text-gray-500 mx-4">{SubscriptionLabels[2].label}</p>
												</div>

												<div tw="mt-10 mb-2">
													<p tw="text-center text-red-400">{SubscriptionLabels[23].label}</p>
												</div>
											</div>

											<div tw="mt-16 pb-12 lg:mt-20 lg:pb-20">
												<div tw="relative z-0">
													<div tw="absolute inset-0 h-5/6 lg:h-2/3"></div>
													<div tw="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
														<div tw="relative lg:grid lg:grid-cols-7">
															{subscriptions && subscriptions?.results ? (
																subscriptions?.results
																	.filter((result) => result.plan.name === "Basic")
																	.map((val, key) => (
																		<BasicPlan
																			data={val}
																			defaultSubscription={defaultSubscription}
																			key={key}
																			setBasicPlanId={setBasicPlanId}
																			setBasicPlanName={setBasicPlanName}
																			setShowModal={setIsChangeToBasicPlanModalVisible}
																			showModal={isChangeToBasicPlanModalVisible}
																		/>
																	))
															) : (
																<span tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
																	<Skeleton duration={2} width={347.41} height={553} />
																</span>
															)}

															{togglePaymentPeriod ? (
																subscriptions?.results ? (
																	subscriptions?.results
																		.filter((result) => result.price.recurring.interval_count === 6)
																		.map((val, key) => (
																			<SemiAnnualPlans
																				data={val}
																				defaultPaymentMethod={defaultPaymentMethod}
																				defaultSubscription={defaultSubscription}
																				disableLocalTime={disableLocalTime}
																				key={key}
																				loadingAgencySemiAnnually={loadingAgencySemiAnnually}
																				loadingProSemiAnnually={loadingProSemiAnnually}
																				setShowModal={setIsPaymentMethodModalVisible}
																				setUpdatedPlanId={setUpdatedPlanId}
																				setUpdatedPlanName={setUpdatedPlanName}
																				showModal={isPaymentMethodModalVisible}
																			/>
																		))
																) : (
																	<>
																		<span tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
																			<Skeleton duration={2} width={521.11} height={811} />
																		</span>
																		<span tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
																			<Skeleton duration={2} width={347.41} height={553} />
																		</span>
																	</>
																)
															) : subscriptions?.results ? (
																subscriptions?.results
																	.filter((result) => result.price.recurring.interval_count === 1)
																	.map((val, key) => (
																		<MonthlyPlans
																			data={val}
																			defaultPaymentMethod={defaultPaymentMethod}
																			defaultSubscription={defaultSubscription}
																			disableLocalTime={disableLocalTime}
																			key={key}
																			loadingAgencyMonthly={loadingAgencyMonthly}
																			loadingProMonthly={loadingProMonthly}
																			setShowModal={setIsPaymentMethodModalVisible}
																			setUpdatedPlanId={setUpdatedPlanId}
																			setUpdatedPlanName={setUpdatedPlanName}
																			showModal={isPaymentMethodModalVisible}
																		/>
																	))
															) : (
																<>
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
								<Footer />
							</div>
						</main>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

export default SubscriptionPlans;
