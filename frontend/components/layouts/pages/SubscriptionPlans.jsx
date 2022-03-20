import { MemoizedChangeToBasicModal } from "@components/modals/ChangeToBasicModal";
import { MemoizedNewActivePlanModal } from "@components/modals/NewActivePlanModal";
import { MemoizedPaymentMethodModal } from "@components/modals/PaymentMethodModal";
import { MemoizedSubscriptionPlansPricing } from "@components/pricing/SubscriptionPlansPricing";
import { CurrentSubscriptionApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { Agency, Basic, ModalDisplayInterval, Pro } from "@constants/GlobalValues";
import { handleDeleteMethod, handlePostMethod } from "@helpers/handleHttpMethods";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `SubscriptionPlansPageLayout` component
 */
const SubscriptionPlansPageLayout = () => {
	const [intervalCount, setIntervalCount] = useState(0);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = useState(false);
	const [loadingBasic, setLoadingBasic] = useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = useState(false);
	const [planId, setPlanId] = useState(null);
	const [planName, setPlanName] = useState(null);
	const [togglePaymentPeriod, setTogglePaymentPeriod] = useState(false);

	// Translations
	const { t } = useTranslation();
	const loadingCardInformationText = t("settings:cardInformationSettings.loadingCardInformation");

	// Custom states
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState(loadingCardInformationText);

	// Custom context
	const { isComponentReady, stripePromise, subscriptions, currentSubscription, setConfig } =
		useContext(SiteCrawlerAppContext);

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// `stripePromise` data state
	const stripePromiseData = useMemo(() => {
		if (isComponentReady && stripePromise) {
			// Handle `stripe` promise data
			const stripePromisePublishableKey = stripePromise?.data?.publishable_key ?? null;

			if (stripePromisePublishableKey) {
				const data = loadStripe(stripePromisePublishableKey);

				return data;
			}
		}
	}, [stripePromise, isComponentReady]);

	// Custom hooks
	const {
		ref: newActivePlanModalRef,
		isComponentVisible: isNewActivePlanModalVisible,
		setIsComponentVisible: setIsNewActivePlanModalVisible
	} = useComponentVisible(false);
	const {
		ref: changeToBasicModalRef,
		isComponentVisible: isChangeToBasicModalVisible,
		setIsComponentVisible: setIsChangeToBasicModalVisible
	} = useComponentVisible(false);
	const {
		ref: paymentMethodModalRef,
		isComponentVisible: isPaymentMethodModalVisible,
		setIsComponentVisible: setIsPaymentMethodModalVisible
	} = useComponentVisible(false);

	// Custom variables
	const currentSubscriptionId = currentSubscription?.data?.id ?? null;
	const subscriptionsResults = subscriptions?.data?.results ?? null;

	// Handle `subscription` results
	useEffect(() => {
		currentSubscriptionId
			? subscriptionsResults
					?.filter((sub) => sub.id === currentSubscription.data.id)
					?.map((val) => setIntervalCount(val.price.recurring.interval_count)) ?? null
			: null;
	}, [currentSubscription]);

	// Handle `togglePaymentPeriod` state
	useEffect(() => (intervalCount > 1 ? setTogglePaymentPeriod(true) : setTogglePaymentPeriod(false)), [intervalCount]);

	// Handle `subscription` update
	const handleSubscriptionUpdate = (id, name) => {
		(async () => {
			const body = {
				id: id
			};

			const currentSubscriptionResponse = await handlePostMethod(CurrentSubscriptionApiEndpoint, body);
			const currentSubscriptionResponseData = currentSubscriptionResponse?.data ?? null;
			const currentSubscriptionResponseStatus = currentSubscriptionResponse?.status ?? null;
			const currentSubscriptionResponseMethod = currentSubscriptionResponse?.config?.method ?? null;

			if (currentSubscriptionResponseData && Math.round(currentSubscriptionResponseStatus / 100) === 2) {
				const currentSubscriptionResponseDataStatus = currentSubscriptionResponseData?.status
					? handleConversionStringToLowercase(currentSubscriptionResponseData.status)
					: null;

				if (currentSubscriptionResponseDataStatus === "paid") {
					// Mutate `currentSubscription` endpoint after successful 200 OK or 201 Created response is issued
					mutate(CurrentSubscriptionApiEndpoint, { ...currentSubscription, data: currentSubscriptionResponseData });

					// Update plan name and id to reflect the updated subscription plan
					await subscriptions?.data?.results
						?.filter((sub) => sub.id === id)
						?.map((val) => {
							setPlanName(val.plan.name);
							setPlanId(val.id);
						});

					// Load monthly `Basic` plan
					setLoadingBasic(false);

					// Don't load monthly `Pro` plan
					setLoadingProMonthly(false);

					// Don't load monthly `Agency` plan
					setLoadingAgencyMonthly(false);

					// Don't load semi-annually `Pro` plan
					setLoadingProSemiAnnually(false);

					// Don't load semi-annually `Agency` plan
					setLoadingAgencySemiAnnually(false);

					// Update `isProcessingPayment` state to false
					setIsProcessingPayment(false);

					// Update `isPaymentMethodModalVisible` state to false
					setIsPaymentMethodModalVisible(false);

					const newActivePlanModalVisibleTimeout = setTimeout(() => {
						// Show the `newActivePlanModal` component
						setIsNewActivePlanModalVisible(true);
					}, ModalDisplayInterval);

					return () => clearTimeout(newActivePlanModalVisibleTimeout);
				} else {
					if (currentSubscriptionResponseDataStatus === "waiting_payment") {
						console.log("WAITING_PAYMENT", currentSubscriptionResponseDataStatus);
					} else {
						console.log("PAYMENT_FAILED", currentSubscriptionResponseDataStatus);

						// Load monthly `Basic` plan
						setLoadingBasic(false);

						// Don't load monthly `Pro` plan
						setLoadingProMonthly(false);

						// Don't load monthly `Agency` plan
						setLoadingAgencyMonthly(false);

						// Don't load semi-annually `Pro` plan
						setLoadingProSemiAnnually(false);

						// Don't load semi-annually `Agency` plan
						setLoadingAgencySemiAnnually(false);

						// Update `isProcessingPayment` state to false
						setIsProcessingPayment(false);
					}
				}
			}

			// Show alert message after unsuccessful 200 OK or 201 Created response is not issued
			setConfig({
				isStripeSubscriptionsCurrent: true,
				method: currentSubscriptionResponseMethod,
				status: currentSubscriptionResponseStatus,
				isAlert: false,
				isNotification: false
			});
		})();

		return () => setIsProcessingPayment(false);
	};

	// Handle plan select
	const handlePlanSelect = (id, name) => {
		// Update `isProcessingPayment` state to true
		setIsProcessingPayment(true);

		// Custom variables
		const sanitizedBasicPlan = handleConversionStringToLowercase(Basic);
		const sanitizedProPlan = handleConversionStringToLowercase(Pro);
		const sanitizedAgencyPlan = handleConversionStringToLowercase(Agency);
		const subscriptionsResults = subscriptions?.data?.results ?? null;

		switch (name) {
			case sanitizedBasicPlan:
				(async () => {
					const body = {
						id: id
					};

					const changeToBasicPlanResponse = await handleDeleteMethod(CurrentSubscriptionApiEndpoint, body);
					const changeToBasicPlanResponseData = changeToBasicPlanResponse?.data ?? null;
					const changeToBasicPlanResponseStatus = changeToBasicPlanResponse?.status ?? null;
					const changeToBasicPlanResponseMethod = changeToBasicPlanResponse?.config?.method ?? null;

					if (changeToBasicPlanResponseData && Math.round(changeToBasicPlanResponseStatus / 100) === 2) {
						// Mutate `currentSubscription` endpoint after successful 200 OK or 201 Created response is issued
						mutate(CurrentSubscriptionApiEndpoint, { ...currentSubscription, data: changeToBasicPlanResponseData });

						const sanitizedChangeToBasicPlanResponseDataStatus = changeToBasicPlanResponseData?.status
							? handleConversionStringToLowercase(changeToBasicPlanResponseData.status)
							: null;

						if (sanitizedChangeToBasicPlanResponseDataStatus === "paid") {
							// Mutate `currentSubscription` endpoint after successful 200 OK or 201 Created response is issued
							mutate(CurrentSubscriptionApiEndpoint, { ...currentSubscription, data: changeToBasicPlanResponseData });

							// Update plan name and id to reflect the updated subscription plan
							await subscriptions?.data?.results
								?.filter((sub) => sub.id === id)
								?.map((val) => {
									setPlanName(val.plan.name);
									setPlanId(val.id);
								});

							// Don't load monthly `Basic` plan
							setLoadingBasic(true);

							// Don't load monthly `Pro` plan
							setLoadingProMonthly(false);

							// Don't load monthly `Agency` plan
							setLoadingAgencyMonthly(false);

							// Don't load semi-annually `Pro` plan
							setLoadingProSemiAnnually(false);

							// Don't load semi-annually `Agency` plan
							setLoadingAgencySemiAnnually(false);

							// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
							mutate(UserApiEndpoint);

							// Don't load monthly `Basic` plan
							setLoadingBasic(false);

							// Update `isProcessingPayment` state to false
							setIsProcessingPayment(false);

							// Update `isNewActivePlanModalVisible` state to false
							setIsNewActivePlanModalVisible(false);
						} else if (sanitizedChangeToBasicPlanResponseDataStatus === "waiting_payment") {
							console.log("WAITING_PAYMENT", sanitizedChangeToBasicPlanResponseDataStatus);
						} else {
							console.log("PAYMENT_FAILED", sanitizedChangeToBasicPlanResponseDataStatus);

							// Load monthly `Basic` plan
							setLoadingBasic(false);

							// Don't load monthly `Pro` plan
							setLoadingProMonthly(false);

							// Don't load monthly `Agency` plan
							setLoadingAgencyMonthly(false);

							// Don't load semi-annually `Pro` plan
							setLoadingProSemiAnnually(false);

							// Don't load semi-annually `Agency` plan
							setLoadingAgencySemiAnnually(false);

							// Update `isProcessingPayment` state to false
							setIsProcessingPayment(false);
						}

						// Update `isPaymentMethodModalVisible` state to false
						setIsChangeToBasicModalVisible(false);

						const newActivePlanModalVisibleTimeout = setTimeout(() => {
							// Show the `newActivePlanModal` component
							setIsNewActivePlanModalVisible(true);
						}, ModalDisplayInterval);

						return () => clearTimeout(newActivePlanModalVisibleTimeout);
					}
				})();
				break;
			case sanitizedProPlan:
				subscriptionsResults
					?.filter((sub) => sub.id === id && handleConversionStringToLowercase(sub.plan.name) === sanitizedProPlan)
					?.map((val) => {
						const subscriptionPlanName = handleConversionStringToLowercase(val.plan.name);
						const subscriptionPlanPriceRecurringIntervalCount = val.price.recurring.interval_count;

						if (subscriptionPlanPriceRecurringIntervalCount === 1) {
							if (subscriptionPlanName === sanitizedProPlan) {
								// Don't load monthly `Basic` plan
								setLoadingBasic(false);

								// Load monthly `Pro` plan
								setLoadingProMonthly(true);

								// Don't load monthly `Agency` plan
								setLoadingAgencyMonthly(false);

								// Don't load semi-annually `Pro` plan
								setLoadingProSemiAnnually(false);

								// Don't load semi-annually `Agency` plan
								setLoadingAgencySemiAnnually(false);
							}
						} else {
							if (subscriptionPlanName === sanitizedProPlan) {
								// Don't load monthly `Basic` plan
								setLoadingBasic(false);

								// Don't load monthly `Pro` plan
								setLoadingProMonthly(false);

								// Don't load monthly `Agency` plan
								setLoadingAgencyMonthly(false);

								// Load semi-annually `Pro` plan
								setLoadingProSemiAnnually(true);

								// Don't load semi-annually `Agency` plan
								setLoadingAgencySemiAnnually(false);
							}
						}
					});

				// Handle `subscription` update custom function here
				return handleSubscriptionUpdate(id, name);
			case sanitizedAgencyPlan:
				subscriptionsResults
					?.filter((sub) => sub.id === id && sub.plan.name === sanitizedAgencyPlan)
					?.map((val) => {
						const subscriptionPlanName = handleConversionStringToLowercase(val.plan.name);
						const subscriptionPlanPriceRecurringIntervalCount = val.price.recurring.interval_count;

						if (subscriptionPlanPriceRecurringIntervalCount === 1) {
							if (subscriptionPlanName === sanitizedAgencyPlan) {
								// Don't load monthly `Basic` plan
								setLoadingBasic(false);

								// Don't load monthly `Pro` plan
								setLoadingProMonthly(false);

								// Load monthly `Agency` plan
								setLoadingAgencyMonthly(true);

								// Don't load semi-annually `Pro` plan
								setLoadingProSemiAnnually(false);

								// Don't load semi-annually `Agency` plan
								setLoadingAgencySemiAnnually(false);
							}
						} else {
							if (subscriptionPlanName === sanitizedAgencyPlan) {
								// Load monthly `Basic` plan
								setLoadingBasic(false);

								// Don't load monthly `Pro` plan
								setLoadingProMonthly(false);

								// Don't load monthly `Agency` plan
								setLoadingAgencyMonthly(false);

								// Don't load semi-annually `Pro` plan
								setLoadingProSemiAnnually(false);

								// Load semi-annually `Agency` plan
								setLoadingAgencySemiAnnually(true);
							}
						}
					});

				// Handle `subscription` update custom function here
				return handleSubscriptionUpdate(id, name);
			default:
				break;
		}
	};

	return stripePromiseData ? (
		<Elements stripe={stripePromiseData}>
			<MemoizedPaymentMethodModal
				ref={paymentMethodModalRef}
				handlePlanSelect={handlePlanSelect}
				isProcessingPayment={isProcessingPayment}
				planId={planId}
				planName={planName}
				setShowModal={setIsPaymentMethodModalVisible}
				showModal={isPaymentMethodModalVisible}
				currentPaymentMethod={currentPaymentMethod}
				setCurrentPaymentMethod={setCurrentPaymentMethod}
			/>

			<MemoizedNewActivePlanModal
				ref={newActivePlanModalRef}
				planId={planId}
				planName={planName}
				setShowModal={setIsNewActivePlanModalVisible}
				showModal={isNewActivePlanModalVisible}
			/>

			<MemoizedChangeToBasicModal
				ref={changeToBasicModalRef}
				planId={planId}
				planName={planName}
				isProcessingPayment={isProcessingPayment}
				handlePlanSelect={handlePlanSelect}
				setShowModal={setIsChangeToBasicModalVisible}
				showModal={isChangeToBasicModalVisible}
			/>

			<div className="flex w-full items-start py-4">
				<MemoizedSubscriptionPlansPricing
					setPlanId={setPlanId}
					setPlanName={setPlanName}
					loadingBasic={loadingBasic}
					loadingProMonthly={loadingProMonthly}
					loadingAgencyMonthly={loadingAgencyMonthly}
					loadingProSemiAnnually={loadingProSemiAnnually}
					loadingAgencySemiAnnually={loadingAgencySemiAnnually}
					setShowModal={setIsPaymentMethodModalVisible}
					setShowChangeToBasicModal={setIsChangeToBasicModalVisible}
					setTogglePaymentPeriod={setTogglePaymentPeriod}
					togglePaymentPeriod={togglePaymentPeriod}
				/>
			</div>
		</Elements>
	) : null;
};

/**
 * Memoized custom `SubscriptionPlansPageLayout` component
 */
export const MemoizedSubscriptionPlansPageLayout = memo(SubscriptionPlansPageLayout);
