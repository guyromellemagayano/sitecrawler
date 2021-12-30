/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MemoizedBasicPlan } from "@components/plans/BasicPlan";
import { MemoizedMonthlyPlans } from "@components/plans/MonthlyPlans";
import { MemoizedSemiAnnualPlans } from "@components/plans/SemiAnnualPlans";
import { useDefaultSubscription } from "@hooks/useDefaultSubscription";
import { useLoading } from "@hooks/useLoading";
import { useSubscriptions } from "@hooks/useSubscriptions";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SubscriptionPlansPricing` component
 */
export function SubscriptionPlansPricing(props) {
	const [disableLocalTime, setDisableLocalTime] = useState(false);

	// Props
	const {
		setPlanId,
		setPlanName,
		setIsChangeToBasicPlanModalVisible,
		setIsPaymentMethodModalVisible,
		setTogglePaymentPeriod,
		togglePaymentPeriod,
		loadingAgencySemiAnnually,
		loadingAgencyMonthly,
		loadingProSemiAnnually,
		loadingProMonthly
	} = props;

	// Translations
	const { t } = useTranslation();
	const subscriptionPlanLabelHeadline = t("settings:subscriptionPlans.headline");
	const subscriptionPlanLabelSubheadline = t("settings:subscriptionPlans.subHeadline");
	const subscriptionPlanBillMonthly = t("settings:subscriptionPlans.bill.monthly");
	const subscriptionPlanBillSemiAnnual = t("settings:subscriptionPlans.bill.semiAnnual");
	const subscriptionCreditDebitCardRequired = t("settings:subscriptionPlans.creditDebitCardRequired");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();
	const { subscriptions, errorSubscriptions, validatingSubscriptions } = useSubscriptions();
	const { defaultSubscription, errorDefaultSubscription, validatingDefaultSubscription } = useDefaultSubscription();

	// Custom hooks
	const { isComponentReady } = useLoading();

	// Handle `user` local time
	const handleUserLocalTime = useCallback(async () => {
		if (!validatingUser) {
			if (!errorUser && typeof user !== "undefined" && user !== null && !user?.data?.detail) {
				const disableLocalTimeUserSetting = user?.data?.settings?.disableLocalTime ?? null;

				if (disableLocalTimeUserSetting !== null) {
					if (disableLocalTimeUserSetting) {
						setDisableLocalTime(true);
					} else {
						setDisableLocalTime(false);
					}
				} else {
					setDisableLocalTime(false);
				}
			}
		}
	}, [user, errorUser, validatingUser]);

	useEffect(() => {
		handleUserLocalTime();
	}, [handleUserLocalTime]);

	return (
		<div tw="w-full h-full flex items-center flex-col justify-center">
			<div tw="flex items-center flex-col flex-wrap pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20">
				<div tw="text-center mb-10">
					<p tw="text-xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10">
						{isComponentReady ? subscriptionPlanLabelHeadline : <Skeleton duration={2} width={460} height={40} />}
					</p>
					<p tw="mt-3 max-w-4xl mx-auto text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
						{isComponentReady ? subscriptionPlanLabelSubheadline : <Skeleton duration={2} width={300} height={32} />}
					</p>
				</div>

				<div tw="flex items-center justify-center">
					<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
						{isComponentReady ? subscriptionPlanBillMonthly : <Skeleton duration={2} width={87} height={28} />}
					</p>

					{isComponentReady ? (
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
						<Skeleton duration={2} width={48} height={24} />
					)}

					<p tw="text-base leading-7 font-medium text-gray-500 mx-4">
						{isComponentReady ? subscriptionPlanBillSemiAnnual : <Skeleton duration={2} width={126} height={28} />}
					</p>
				</div>

				<div tw="mt-10 mb-2">
					<p tw="text-center text-red-400">
						{isComponentReady ? (
							"*" + subscriptionCreditDebitCardRequired
						) : (
							<Skeleton duration={2} width={196} height={24} />
						)}
					</p>
				</div>
			</div>

			<div tw="mt-16 pb-12 lg:mt-20 lg:pb-20">
				<div tw="relative z-0">
					<div tw="absolute inset-0 h-5/6 lg:h-2/3"></div>
					<div tw="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
						<div tw="relative lg:grid lg:grid-cols-7">
							{!validatingSubscriptions && !validatingDefaultSubscription ? (
								!errorSubscriptions &&
								typeof subscriptions !== "undefined" &&
								subscriptions !== null &&
								!subscriptions?.data?.detail &&
								!errorDefaultSubscription &&
								typeof defaultSubscription !== "undefined" &&
								defaultSubscription !== null &&
								!defaultSubscription?.data?.detail ? (
									subscriptions
										?.filter((result) => result.plan.name === "Basic")
										?.map((val, key) => (
											<MemoizedBasicPlan
												key={key}
												data={val}
												defaultSubscription={defaultSubscription}
												setShowModal={setIsChangeToBasicPlanModalVisible}
												setPlanId={setPlanId}
												setPlanName={setPlanName}
											/>
										)) ?? null
								) : null
							) : (
								<span tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
									<Skeleton duration={2} width={347.41} height={553} />
								</span>
							)}

							{togglePaymentPeriod ? (
								!validatingSubscriptions ? (
									!errorSubscriptions &&
									typeof subscriptions !== "undefined" &&
									subscriptions !== null &&
									!subscriptions?.data?.detail ? (
										subscriptions
											?.filter((result) => result.price.recurring.interval_count === 6)
											?.map((val, key) => (
												<MemoizedSemiAnnualPlans
													key={key}
													data={val}
													defaultSubscription={defaultSubscription}
													disableLocalTime={disableLocalTime}
													loadingAgencySemiAnnually={loadingAgencySemiAnnually}
													loadingProSemiAnnually={loadingProSemiAnnually}
													setShowModal={setIsPaymentMethodModalVisible}
													setPlanId={setPlanId}
													setPlanName={setPlanName}
												/>
											))
									) : null
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
							) : !validatingSubscriptions && !validatingDefaultSubscription ? (
								!errorSubscriptions &&
								typeof subscriptions !== "undefined" &&
								subscriptions !== null &&
								!subscriptions?.data?.detail &&
								!errorDefaultSubscription &&
								typeof defaultSubscription !== "undefined" &&
								defaultSubscription !== null &&
								!defaultSubscription?.data?.detail ? (
									subscriptions
										?.filter((result) => result.price.recurring.interval_count === 1)
										?.map((val, key) => (
											<MemoizedMonthlyPlans
												key={key}
												data={val}
												defaultSubscription={defaultSubscription}
												disableLocalTime={disableLocalTime}
												loadingAgencyMonthly={loadingAgencyMonthly}
												loadingProMonthly={loadingProMonthly}
												setShowModal={setIsPaymentMethodModalVisible}
												setPlanId={setPlanId}
												setPlanName={setPlanName}
											/>
										))
								) : null
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
	);
}

/**
 * Memoized custom `SubscriptionPlansPricing` component
 */
export const MemoizedSubscriptionPlansPricing = memo(SubscriptionPlansPricing);
