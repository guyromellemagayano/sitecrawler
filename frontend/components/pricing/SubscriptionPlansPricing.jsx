/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MemoizedBasicPlan } from "@components/plans/BasicPlan";
import { MemoizedMonthlyPlans } from "@components/plans/MonthlyPlans";
import { MemoizedSemiAnnualPlans } from "@components/plans/SemiAnnualPlans";
import { useSubscriptions } from "@hooks/useSubscriptions";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SubscriptionPlansPricing` component
 *
 * @param {boolean} disableLocalTime
 * @param {boolean} loadingAgencySemiAnnually
 * @param {boolean} loadingProSemiAnnually
 * @param {boolean} loadingAgencyMonthly
 * @param {boolean} loadingProMonthly
 * @param {boolean} togglePaymentPeriod
 * @param {function} setTogglePaymentPeriod
 * @param {function} setPlanId
 * @param {function} setPlanName
 * @param {function} setOpen
 */
const SubscriptionPlansPricing = ({
	setPlanId,
	setPlanName,
	setOpen,
	setTogglePaymentPeriod,
	togglePaymentPeriod,
	loadingAgencySemiAnnually,
	loadingAgencyMonthly,
	loadingProSemiAnnually,
	loadingProMonthly
}) => {
	// Translations
	const { t } = useTranslation();
	const subscriptionPlanLabelHeadline = t("settings:subscriptionPlans.headline");
	const subscriptionPlanLabelSubheadline = t("settings:subscriptionPlans.subHeadline");
	const subscriptionPlanBillMonthly = t("settings:subscriptionPlans.bill.monthly");
	const subscriptionPlanBillSemiAnnual = t("settings:subscriptionPlans.bill.semiAnnual");
	const subscriptionCreditDebitCardRequired = t("settings:subscriptionPlans.creditDebitCardRequired");

	// Custom context
	const { setConfig, isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, disableLocalTime } = useUser();
	const { subscriptions } = useSubscriptions();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div className="flex flex-col flex-wrap items-center px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
				<div className="mb-10 text-center">
					<p className="text-xl font-bold leading-9 tracking-tight text-gray-900 sm:text-3xl sm:leading-10">
						{isComponentReady ? subscriptionPlanLabelHeadline : <Skeleton duration={2} width={460} height={40} />}
					</p>
					<p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
						{isComponentReady ? subscriptionPlanLabelSubheadline : <Skeleton duration={2} width={300} height={32} />}
					</p>
				</div>

				<div className="flex items-center justify-center">
					<p className="mx-4 text-base font-medium leading-7 text-gray-500">
						{isComponentReady &&
						subscriptions &&
						Math.round(subscriptions?.status / 100) === 2 &&
						!subscriptions?.data?.detail ? (
							subscriptionPlanBillMonthly
						) : (
							<Skeleton duration={2} width={87} height={28} />
						)}
					</p>

					{isComponentReady &&
					subscriptions &&
					Math.round(subscriptions?.status / 100) === 2 &&
					!subscriptions?.data?.detail ? (
						<span
							role="checkbox"
							tabIndex="0"
							onClick={() => setTogglePaymentPeriod(!togglePaymentPeriod)}
							aria-checked={togglePaymentPeriod}
							className={classnames(
								"relative mx-auto inline-flex h-6 w-12 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring",
								togglePaymentPeriod ? "bg-indigo-600" : "bg-gray-200"
							)}
						>
							<span
								aria-hidden="true"
								role="button"
								tabIndex="0"
								className={classnames(
									"inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
									togglePaymentPeriod ? "translate-x-6" : "translate-x-0"
								)}
							/>
						</span>
					) : (
						<Skeleton duration={2} width={48} height={24} />
					)}

					<p className="mx-4 text-base font-medium leading-7 text-gray-500">
						{isComponentReady &&
						subscriptions &&
						Math.round(subscriptions?.status / 100) === 2 &&
						!subscriptions?.data?.detail ? (
							subscriptionPlanBillSemiAnnual
						) : (
							<Skeleton duration={2} width={126} height={28} />
						)}
					</p>
				</div>

				<div className="mt-10 mb-2">
					<p className="text-center text-red-400">
						{isComponentReady &&
						subscriptions &&
						Math.round(subscriptions?.status / 100) === 2 &&
						!subscriptions?.data?.detail ? (
							"*" + subscriptionCreditDebitCardRequired
						) : (
							<Skeleton duration={2} width={196} height={24} />
						)}
					</p>
				</div>
			</div>

			<div className="mt-16 pb-12 lg:mt-20 lg:pb-20">
				<div className="relative z-0">
					<div className="absolute inset-0 h-5/6 lg:h-2/3"></div>
					<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
						<div className="relative lg:grid lg:grid-cols-7">
							{isComponentReady &&
							subscriptions &&
							Math.round(subscriptions?.status / 100) === 2 &&
							!subscriptions?.data?.detail ? (
								subscriptions?.data?.results
									?.filter((result) => result.plan.name === "Basic")
									?.map((val, key) => (
										<MemoizedBasicPlan
											key={key}
											data={val}
											setOpen={setOpen}
											setPlanId={setPlanId}
											setPlanName={setPlanName}
										/>
									)) ?? null
							) : (
								<span className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none">
									<Skeleton duration={2} width={347.41} height={553} />
								</span>
							)}

							{togglePaymentPeriod ? (
								isComponentReady &&
								subscriptions &&
								Math.round(subscriptions?.status / 100) === 2 &&
								!subscriptions?.data?.detail ? (
									subscriptions?.data?.results
										?.filter((result) => result.price.recurring.interval_count === 6)
										?.map((val, key) => (
											<MemoizedSemiAnnualPlans
												key={key}
												data={val}
												disableLocalTime={disableLocalTime}
												loadingAgencySemiAnnually={loadingAgencySemiAnnually}
												loadingProSemiAnnually={loadingProSemiAnnually}
												setOpen={setOpen}
												setPlanId={setPlanId}
												setPlanName={setPlanName}
											/>
										)) ?? null
								) : (
									<>
										<span className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
											<Skeleton duration={2} width={521.11} height={811} />
										</span>
										<span className="mx-auto mt-10 max-w-md lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
											<Skeleton duration={2} width={347.41} height={553} />
										</span>
									</>
								)
							) : isComponentReady &&
							  subscriptions &&
							  Math.round(subscriptions?.status / 100) === 2 &&
							  !subscriptions?.data?.detail ? (
								subscriptions?.data?.results
									?.filter((result) => result.price.recurring.interval_count === 1)
									?.map((val, key) => (
										<MemoizedMonthlyPlans
											key={key}
											data={val}
											disableLocalTime={disableLocalTime}
											loadingAgencyMonthly={loadingAgencyMonthly}
											loadingProMonthly={loadingProMonthly}
											setOpen={setOpen}
											setPlanId={setPlanId}
											setPlanName={setPlanName}
										/>
									)) ?? null
							) : (
								<>
									<span className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
										<Skeleton duration={2} width={521.11} height={811} />
									</span>
									<span className="mx-auto mt-10 max-w-md lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
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
};

SubscriptionPlansPricing.propTypes = {
	loadingAgencyMonthly: PropTypes.bool,
	loadingAgencySemiAnnually: PropTypes.bool,
	loadingProMonthly: PropTypes.bool,
	loadingProSemiAnnually: PropTypes.bool,
	setOpen: PropTypes.func,
	setPlanId: PropTypes.func,
	setPlanName: PropTypes.func,
	setTogglePaymentPeriod: PropTypes.func,
	togglePaymentPeriod: PropTypes.bool
};

/**
 * Memoized custom `SubscriptionPlansPricing` component
 */
export const MemoizedSubscriptionPlansPricing = memo(SubscriptionPlansPricing);
