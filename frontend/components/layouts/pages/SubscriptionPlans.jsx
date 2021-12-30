import { MemoizedAlert } from "@components/alerts";
// import { MemoizedChangeToBasicModal } from "@components/modals/ChangeToBasicModal";
import { MemoizedNewActivePlanModal } from "@components/modals/NewActivePlanModal";
import { MemoizedPaymentMethodModal } from "@components/modals/PaymentMethodModal";
import { MemoizedSubscriptionPlansPricing } from "@components/pricing/SubscriptionPlansPricing";
import { CurrentSubscriptionApiEndpoint, PaymentMethodApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { Basic } from "@constants/GlobalValues";
import { handleDeleteMethod, handlePostMethod } from "@helpers/handleHttpMethods";
import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useDefaultSubscription } from "@hooks/useDefaultSubscription";
import { useSubscriptions } from "@hooks/useSubscriptions";
import { memo, useCallback, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import "twin.macro";

/**
 * Custom function to render the `SubscriptionPlansPageLayout` component
 */
export function SubscriptionPlansPageLayout() {
	const [disableDowngradeToBasicPlan, setDisableDowngradeToBasicPlan] = useState(false);
	const [intervalCount, setIntervalCount] = useState(0);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [loadingAgencyMonthly, setLoadingAgencyMonthly] = useState(false);
	const [loadingAgencySemiAnnually, setLoadingAgencySemiAnnually] = useState(false);
	const [loadingBasicMonthly, setLoadingBasicMonthly] = useState(false);
	const [loadingProMonthly, setLoadingProMonthly] = useState(false);
	const [loadingProSemiAnnually, setLoadingProSemiAnnually] = useState(false);
	const [planId, setPlanId] = useState(null);
	const [planName, setPlanName] = useState(null);

	const [togglePaymentPeriod, setTogglePaymentPeriod] = useState(false);

	// SWR hooks

	const { subscriptions, errorSubscriptions, validatingSubscriptions } = useSubscriptions();
	const { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription } = useDefaultSubscription();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();
	const {
		ref: newActivePlanModalRef,
		isComponentVisible: isNewActivePlanModalVisible,
		setIsComponentVisible: setIsNewActivePlanModalVisible
	} = useComponentVisible(false);
	const {
		ref: changeToBasicPlanModalRef,
		isComponentVisible: isChangeToBasicPlanModalVisible,
		setIsComponentVisible: setIsChangeToBasicPlanModalVisible
	} = useComponentVisible(false);
	const {
		ref: paymentMethodModalRef,
		isComponentVisible: isPaymentMethodModalVisible,
		setIsComponentVisible: setIsPaymentMethodModalVisible
	} = useComponentVisible(false);

	// Handle `subscription` update
	const handleSubscriptionUpdate = async (subId) => {
		const body = {
			id: subId
		};

		const currentSubscriptionResponse = await handlePostMethod(CurrentSubscriptionApiEndpoint, body);
		const currentSubscriptionResponseData = currentSubscriptionResponse?.data ?? null;
		const currentSubscriptionResponseDataStatus = currentSubscriptionResponseData?.status ?? null;
		const currentSubscriptionResponseStatus = currentSubscriptionResponse?.status ?? null;
		const currentSubscriptionResponseMethod = currentSubscriptionResponse?.config?.method ?? null;

		if (
			currentSubscriptionResponseData !== null &&
			currentSubscriptionResponseDataStatus === "PAID" &&
			Math.round(currentSubscriptionResponseStatus / 200) === 1
		) {
			// Mutate `currentSubscription` endpoint after successful 200 OK or 201 Created response is issued
			mutate(CurrentSubscriptionApiEndpoint, false);

			if (!validatingSubscriptions) {
				if (
					!errorSubscriptions &&
					typeof subscriptions !== "undefined" &&
					subscriptions !== null &&
					!subscriptions?.data?.detail
				) {
					// Update plan name and id to reflect the updated subscription plan
					subscriptions
						?.filter((sub) => sub.id === subId)
						?.map((val) => {
							setPlanName(val.plan.name);
							setPlanId(val.id);
						}) ?? null;

					// Update `isProcessingPayment` state to false
					setIsProcessingPayment(false);
				}
			}
		} else {
			// Allow downgrade to Basic Plan
			setDisableDowngradeToBasicPlan(false);

			// Update `isPaymentMethodModalVisible` state to false
			setIsPaymentMethodModalVisible(false);

			// Show alert message after unsuccessful 200 OK or 201 Created response is not issued
			setConfig({
				isCurrentSubscription: true,
				method: currentSubscriptionResponseMethod,
				status: currentSubscriptionResponseStatus
			});
		}
	};

	// Handle plan select
	const handlePlanSelect = async (id, name, selectedPaymentMethod) => {
		if (name === Basic) {
			const currentSubscriptionResponse = await handleDeleteMethod(CurrentSubscriptionApiEndpoint);
			const currentSubscriptionResponseData = currentSubscriptionResponse?.data ?? null;
			const currentSubscriptionResponseDataStatus = currentSubscriptionResponseData?.status ?? null;
			const currentSubscriptionResponseStatus = currentSubscriptionResponse?.status ?? null;
			const currentSubscriptionResponseMethod = currentSubscriptionResponse?.config?.method ?? null;

			if (
				currentSubscriptionResponseData !== null &&
				currentSubscriptionResponseDataStatus === "PAID" &&
				Math.round(currentSubscriptionResponseStatus / 200) === 1
			) {
				// Disable downgrade to Basic Plan
				setDisableDowngradeToBasicPlan(true);

				// Mutate `currentSubscription` endpoint after successful 200 OK or 201 Created response is issued
				mutate(CurrentSubscriptionApiEndpoint, false);

				const cancelAtCurrentSubscription = currentSubscriptionResponse?.cancel_at ?? null;

				if (cancelAtCurrentSubscription !== null) {
					// Allow downgrade to Basic Plan
					setDisableDowngradeToBasicPlan(false);

					// Don't load monthly `Pro` plan
					setLoadingProMonthly(false);

					// Don't load monthly `Agency` plan
					setLoadingAgencyMonthly(false);

					// Don't load semi-annually `Pro` plan
					setLoadingProSemiAnnually(false);

					// Don't load semi-annually `Agency` plan
					setLoadingAgencySemiAnnually(false);

					// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
					mutate(UserApiEndpoint, false);

					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isCurrentSubscription: true,
						method: currentSubscriptionResponseMethod,
						status: currentSubscriptionResponseStatus
					});
				}
			} else {
				// Allow downgrade to Basic Plan
				setDisableDowngradeToBasicPlan(false);

				// Show alert message after unsuccessful 200 OK or 201 Created response is not issued
				setConfig({
					isCurrentSubscription: true,
					method: currentSubscriptionResponseMethod,
					status: currentSubscriptionResponseStatus
				});
			}
		} else if (typeof selectedPaymentMethod !== "undefined" && selectedPaymentMethod !== null) {
			const body = {
				id: selectedPaymentMethod
			};

			// Update `isProcessingPayment` state to true
			setIsProcessingPayment(true);

			const paymentMethodResponse = await handlePostMethod(PaymentMethodApiEndpoint, body);
			const paymentMethodResponseData = paymentMethodResponse?.data ?? null;
			const paymentMethodResponseDataStatus = paymentMethodResponseData?.status ?? null;
			const paymentMethodResponseDataMethod = paymentMethodResponse?.config?.method ?? null;

			if (paymentMethodResponseData !== null && Math.round(paymentMethodResponseDataStatus / 200) === 1) {
				const subscriptionResults = subscriptions?.results ?? null;

				if (subscriptionResults !== null) {
					subscriptionResults
						?.filter((sub) => sub.id === id)
						?.map((value) => {
							const subscriptionPlanName = handleStringToLowerCase(value?.plan?.name ?? null);
							const subscriptionPlanPriceRecurringInterval = handleStringToLowerCase(
								value?.price?.recurring?.interval ?? null
							);
							const subscriptionPlanPriceRecurringIntervalCount = value?.price?.recurring?.interval_count ?? null;

							if (subscriptionPlanPriceRecurringInterval === "month") {
								if (subscriptionPlanPriceRecurringIntervalCount === 1) {
									if (subscriptionPlanName === "pro") {
										// Don't load monthly `Basic` plan
										setLoadingBasicMonthly(false);

										// Load monthly `Pro` plan
										setLoadingProMonthly(true);

										// Don't load monthly `Agency` plan
										setLoadingAgencyMonthly(false);

										// Don't load semi-annually `Pro` plan
										setLoadingProSemiAnnually(false);

										// Don't load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(false);

										return;
									} else if (subscriptionPlanName === "agency") {
										// Don't load monthly `Basic` plan
										setLoadingBasicMonthly(false);

										// Don't load monthly `Pro` plan
										setLoadingProMonthly(false);

										// Load monthly `Agency` plan
										setLoadingAgencyMonthly(true);

										// Don't load semi-annually `Pro` plan
										setLoadingProSemiAnnually(false);

										// Don't load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(false);

										return;
									} else {
										// Load monthly `Basic` plan
										setLoadingBasicMonthly(true);

										// Don't load monthly `Pro` plan
										setLoadingProMonthly(false);

										// Don't load monthly `Agency` plan
										setLoadingAgencyMonthly(false);

										// Don't load semi-annually `Pro` plan
										setLoadingProSemiAnnually(false);

										// Don't load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(false);

										return;
									}
								} else {
									if (subscriptionPlanName === "pro") {
										// Don't load monthly `Pro` plan
										setLoadingProMonthly(false);

										// Don't load monthly `Agency` plan
										setLoadingAgencyMonthly(false);

										// Load semi-annually `Pro` plan
										setLoadingProSemiAnnually(true);

										// Don't load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(false);

										return;
									} else if (subscriptionPlanName === "agency") {
										// Don't load monthly `Pro` plan
										setLoadingProMonthly(false);

										// Don't load monthly `Agency` plan
										setLoadingAgencyMonthly(false);

										// Don't load semi-annually `Pro` plan
										setLoadingProSemiAnnually(false);

										// Load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(true);

										return;
									} else {
										// Don't load monthly `Pro` plan
										setLoadingProMonthly(false);

										// Don't load monthly `Agency` plan
										setLoadingAgencyMonthly(false);

										// Don't load semi-annually `Pro` plan
										setLoadingProSemiAnnually(false);

										// Don't load semi-annually `Agency` plan
										setLoadingAgencySemiAnnually(false);

										return;
									}
								}
							}

							// Handle `subscription` update custom function here
							handleSubscriptionUpdate(id);
						});
				}
			} else {
				// Update `isProcessingPayment` state to true
				setIsProcessingPayment(false);

				// Show alert message after unsuccessful 200 OK or 201 Created response is not issued
				setConfig({
					isPaymentMethod: true,
					method: paymentMethodResponseDataMethod,
					status: paymentMethodResponseDataStatus
				});
			}
		} else return;
	};

	// Handle current payment period
	const handleCurrentPaymentPeriod = useCallback(async () => {
		if (!validatingDefaultSubscription && !validatingSubscriptions) {
			if (
				!errorDefaultSubscription &&
				typeof defaultSubscription !== "undefined" &&
				defaultSubscription !== null &&
				!defaultSubscription?.data?.detail &&
				!errorSubscriptions &&
				typeof subscriptions !== "undefined" &&
				subscriptions !== null &&
				!subscriptions?.data?.detail
			) {
				subscriptions
					?.filter((sub) => sub.id === defaultSubscription?.id)
					?.map((val) => {
						setIntervalCount(val.price.recurring.interval_count);
					}) ?? null;
			}
		}
	}, [
		defaultSubscription,
		errorDefaultSubscription,
		validatingDefaultSubscription,
		subscriptions,
		errorSubscriptions,
		validatingSubscriptions
	]);

	useEffect(() => {
		handleCurrentPaymentPeriod();
	}, [handleCurrentPaymentPeriod]);

	// Handle `togglePaymentPeriod` state
	const handleTogglePaymentPeriod = useCallback(() => {
		if (intervalCount > 1) {
			setTogglePaymentPeriod(true);
		} else {
			setTogglePaymentPeriod(false);
		}
	}, [intervalCount]);

	useEffect(() => {
		handleTogglePaymentPeriod();
	}, [handleTogglePaymentPeriod]);

	return (
		<>
			{state?.responses !== [] && state?.responses?.length > 0 ? (
				<div tw="fixed z-9999 right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto">
					{state?.responses?.map((value, key) => {
						// Alert Messsages
						const responseText = value?.responseText ?? null;
						const isSuccess = value?.isSuccess ?? null;

						return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
					}) ?? null}
				</div>
			) : null}

			<MemoizedPaymentMethodModal
				ref={paymentMethodModalRef}
				handlePlanSelect={handlePlanSelect}
				isProcessingPayment={isProcessingPayment}
				planId={planId}
				planName={planName}
				setShowModal={setIsPaymentMethodModalVisible}
				showModal={isPaymentMethodModalVisible}
			/>

			<MemoizedNewActivePlanModal
				ref={newActivePlanModalRef}
				planId={planId}
				planName={planName}
				setShowModal={setIsNewActivePlanModalVisible}
				showModal={isNewActivePlanModalVisible}
				subscriptions={subscriptions}
			/>

			{/* <MemoizedChangeToBasicModal
				ref={changeToBasicPlanModalRef}
				planId={planId}
				planName={planName}
				defaultSubscription={defaultSubscriptionData}
				disableDowngradeToBasicPlan={disableDowngradeToBasicPlan}
				handlePlanSelect={handlePlanSelect}
				setShowModal={setIsChangeToBasicPlanModalVisible}
				showModal={isChangeToBasicPlanModalVisible}
			/> */}

			<div tw="w-full flex items-start py-4">
				<MemoizedSubscriptionPlansPricing
					setPlanId={setPlanId}
					setPlanName={setPlanName}
					loadingBasicMonthly={loadingBasicMonthly}
					loadingProMonthly={loadingProMonthly}
					loadingAgencyMonthly={loadingAgencyMonthly}
					loadingProSemiAnnually={loadingProSemiAnnually}
					loadingAgencySemiAnnually={loadingAgencySemiAnnually}
					setIsChangeToBasicPlanModalVisible={setIsChangeToBasicPlanModalVisible}
					setIsPaymentMethodModalVisible={setIsPaymentMethodModalVisible}
					setTogglePaymentPeriod={setTogglePaymentPeriod}
					togglePaymentPeriod={togglePaymentPeriod}
				/>
			</div>
		</>
	);
}

/**
 * Memoized custom `SubscriptionPlansPageLayout` component
 */
export const MemoizedSubscriptionPlansPageLayout = memo(SubscriptionPlansPageLayout);
