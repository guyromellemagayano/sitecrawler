/* eslint-disable jsx-a11y/click-events-have-key-events */
import { MemoizedBasicPlan } from "@components/plans/BasicPlan";
import { MemoizedMonthlyPlans } from "@components/plans/MonthlyPlans";
import { MemoizedSemiAnnualPlans } from "@components/plans/SemiAnnualPlans";
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
 * @param {boolean} loadingBasic
 * @param {boolean} loadingAgencySemiAnnually
 * @param {boolean} loadingProSemiAnnually
 * @param {boolean} loadingAgencyMonthly
 * @param {boolean} loadingProMonthly
 * @param {boolean} togglePaymentPeriod
 * @param {function} setTogglePaymentPeriod
 * @param {function} setPlanId
 * @param {function} setPlanName
 * @param {function} setShowModal
 * @param {function} setShowChangeToBasicModal
 */
const SubscriptionPlansPricing = ({
	setPlanId,
	setPlanName,
	setShowModal,
	setTogglePaymentPeriod,
	togglePaymentPeriod,
	loadingBasic,
	loadingAgencySemiAnnually,
	loadingAgencyMonthly,
	loadingProSemiAnnually,
	loadingProMonthly,
	setShowChangeToBasicModal
}) => {
	// Translations
	const { t } = useTranslation();
	const labelHeadlineText = t("settings:subscriptionPlans.headline");
	const labelSubheadlineText = t("settings:subscriptionPlans.subHeadline");
	const billMonthlyText = t("settings:subscriptionPlans.bill.monthly");
	const billSemiAnnualText = t("settings:subscriptionPlans.bill.semiAnnual");
	const creditDebitCardRequiredText = t("settings:subscriptionPlans.creditDebitCardRequired");

	// Custom context
	const { isComponentReady, user, subscriptions } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const subscriptionsResults = subscriptions?.data?.results ?? null;
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;

	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div className="flex flex-col flex-wrap items-center px-4 pt-12 sm:px-6 lg:px-8 lg:pt-20">
				<div className="mb-10 text-center">
					<p className="text-xl font-bold leading-9 tracking-tight text-gray-900 sm:text-3xl sm:leading-10">
						{isComponentReady ? labelHeadlineText : <Skeleton duration={2} width={460} height={40} />}
					</p>
					<p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8">
						{isComponentReady ? labelSubheadlineText : <Skeleton duration={2} width={300} height={32} />}
					</p>
				</div>

				<div className="flex items-center justify-center">
					{isComponentReady ? (
						<p className="mx-4 text-base font-medium leading-7 text-gray-500">{billMonthlyText}</p>
					) : (
						<Skeleton duration={2} width={87} height={28} className="mx-4" />
					)}

					{isComponentReady ? (
						<span
							role="checkbox"
							tabIndex="0"
							onClick={(e) => setTogglePaymentPeriod(!togglePaymentPeriod)}
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

					{isComponentReady ? (
						<p className="mx-4 text-base font-medium leading-7 text-gray-500">{billSemiAnnualText}</p>
					) : (
						<Skeleton duration={2} width={126} height={28} className="mx-4" />
					)}
				</div>

				<div className="mt-10 mb-2">
					{isComponentReady ? (
						<p className="text-center text-red-400">{"*" + creditDebitCardRequiredText}</p>
					) : (
						<Skeleton duration={2} width={196} height={24} />
					)}
				</div>
			</div>

			<div className="mt-16 pb-12 lg:mt-20 lg:pb-20">
				<div className="relative z-0">
					<div className="absolute inset-0 h-5/6 lg:h-2/3"></div>
					<div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
						<div className="relative lg:grid lg:grid-cols-7">
							{subscriptionsResults
								?.filter((result) => result.plan.name === "Basic")
								?.map((val, key) => (
									<MemoizedBasicPlan
										key={key}
										data={val}
										setShowModal={setShowChangeToBasicModal}
										loadingBasic={loadingBasic}
										setPlanId={setPlanId}
										setPlanName={setPlanName}
									/>
								)) ?? (
								<span className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none">
									<Skeleton duration={2} width={347.41} height={553} />
								</span>
							)}

							{togglePaymentPeriod
								? subscriptionsResults
										?.filter((result) => result.price.recurring.interval_count === 6)
										?.map((val, key) => (
											<MemoizedSemiAnnualPlans
												key={key}
												data={val}
												disableLocalTime={disableLocalTime}
												loadingAgencySemiAnnually={loadingAgencySemiAnnually}
												loadingProSemiAnnually={loadingProSemiAnnually}
												setShowModal={setShowModal}
												setPlanId={setPlanId}
												setPlanName={setPlanName}
											/>
										)) ?? (
										<>
											<span className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
												<Skeleton duration={2} width={521.11} height={811} />
											</span>
											<span className="mx-auto mt-10 max-w-md lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
												<Skeleton duration={2} width={347.41} height={553} />
											</span>
										</>
								  )
								: subscriptionsResults
										?.filter((result) => result.price.recurring.interval_count === 1)
										?.map((val, key) => (
											<MemoizedMonthlyPlans
												key={key}
												data={val}
												disableLocalTime={disableLocalTime}
												loadingAgencyMonthly={loadingAgencyMonthly}
												loadingProMonthly={loadingProMonthly}
												setShowModal={setShowModal}
												setPlanId={setPlanId}
												setPlanName={setPlanName}
											/>
										)) ?? (
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
	loadingBasic: PropTypes.bool,
	loadingProMonthly: PropTypes.bool,
	loadingProSemiAnnually: PropTypes.bool,
	setPlanId: PropTypes.func,
	setPlanName: PropTypes.func,
	setShowModal: PropTypes.func,
	setTogglePaymentPeriod: PropTypes.func,
	togglePaymentPeriod: PropTypes.bool
};

/**
 * Memoized custom `SubscriptionPlansPricing` component
 */
export const MemoizedSubscriptionPlansPricing = memo(SubscriptionPlansPricing);
