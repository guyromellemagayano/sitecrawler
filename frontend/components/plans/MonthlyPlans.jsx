import { handleUnitAmountToRealPrice } from "@helpers/handleUnitAmountToRealPrice";
import { CheckIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext } from "react";

/**
 * Custom function to render the "MonthlyPlans" component
 *
 * @param {object} data
 * @param {boolean} disableLocalTime
 * @param {boolean} loadingAgencyMonthly
 * @param {boolean} loadingProMonthly
 * @param {function} setPlanId
 * @param {function} setPlanName
 * @param {function} setShowModal
 */
const MonthlyPlans = ({
	data = null,
	disableLocalTime = false,
	loadingAgencyMonthly = false,
	loadingProMonthly = false,
	setShowModal,
	setPlanId,
	setPlanName
}) => {
	// Translation
	const { t } = useTranslation();
	const monthlyText = t("settings:subscriptionPlans.monthly");
	const selectPlanText = t("settings:subscriptionPlans.plan.select");
	const currentPlanText = t("settings:subscriptionPlans.plan.current");
	const mostPopularText = t("settings:subscriptionPlans.mostPopular");
	const processingPlanText = t("settings:subscriptionPlans.processingPlan");
	const endsOnText = t("settings:subscriptionPlans.endsOn");

	// Custom contexts
	const { currentSubscription } = useContext(SiteCrawlerAppContext);

	// Calendar and dayJS plugins
	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	// Custom variables
	const planId = data?.id ?? null;
	const planName = handleConversionStringToLowercase(data?.plan?.name ?? null);
	const planNameTitle = data?.plan?.name ?? null;
	const planPrice = handleUnitAmountToRealPrice(data?.price?.unit_amount ?? null);
	const planFeatures = data?.features ?? null;
	const currentSubscriptionStatus = currentSubscription?.data?.status ?? null;
	const currentSubscriptionId = currentSubscription?.data?.id ?? null;
	const currentSubscriptionCancelAt = currentSubscription?.data?.cancel_at ?? null;
	const sanitizedCurrentSubscriptionStatus = currentSubscriptionStatus
		? handleConversionStringToLowercase(currentSubscriptionStatus)
		: null;

	return planName === "pro" ? (
		<div className="mx-auto mt-10 max-w-lg lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4 lg:mx-0 lg:mt-0 lg:max-w-none">
			<div className="relative rounded-lg shadow-xl">
				<div className="pointer-events-none absolute inset-0 rounded-lg border border-indigo-600"></div>
				<div className="absolute inset-x-0 top-0 translate-y-px transform">
					<div className="flex -translate-y-1/2 transform justify-center">
						<span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold uppercase leading-5 tracking-wider text-white">
							{mostPopularText}
						</span>
					</div>
				</div>
				<div className="rounded-t-lg bg-white px-6 pt-12 pb-10">
					<div>
						<h3 className="text-center text-3xl font-semibold leading-9 text-gray-900 sm:-mx-6" id="tier-growth">
							{planNameTitle}
							<span className="text-red-400">*</span>
						</h3>
						<div className="mt-4 flex items-center justify-center">
							<span className="flex items-start px-3 text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl">
								<span className="mt-2 mr-2 text-4xl font-medium">$</span>
								<span className="font-bold">{planPrice}</span>
							</span>
							<span className="text-2xl font-medium leading-8 text-gray-500">{"/" + monthlyText}</span>
						</div>
					</div>
				</div>
				<div className="rounded-b-lg border-t border-gray-300 bg-white px-6 pt-10 pb-8 sm:px-10 sm:py-10">
					{planFeatures ? (
						<ul>
							{planFeatures.map((val2, key) => (
								<li key={key} className="my-3 flex items-start">
									<div className="flex-shrink-0">
										<CheckIcon className="h-5 w-5 text-green-500" />
									</div>
									<p className="ml-3 text-base font-medium leading-6 text-gray-500">{val2}</p>
								</li>
							))}
						</ul>
					) : null}

					<div className="mt-10">
						<div className={classnames("rounded-lg", planId === currentSubscriptionId ? "shadow-none" : "shadow-sm")}>
							{planId === currentSubscriptionId &&
							sanitizedCurrentSubscriptionStatus === "paid" &&
							currentSubscriptionCancelAt?.length > 0 ? (
								<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
									<span className="px-2 py-5 text-center text-gray-600">
										<p className="text-sm font-medium">{endsOnText}</p>
										<p className="text-xs text-gray-500">
											{!disableLocalTime
												? dayjs(currentSubscriptionCancelAt).calendar(null, calendarStrings)
												: dayjs.utc(currentSubscriptionCancelAt).calendar(null, calendarStrings)}
											<span className="ml-1 font-medium">({!disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
										</p>
									</span>
								</div>
							) : null}

							<button
								type="button"
								disabled={planId === currentSubscriptionId}
								aria-disabled={planId === currentSubscriptionId}
								aria-hidden={planId === currentSubscriptionId}
								className={classnames(
									"block w-full rounded-lg border border-transparent px-6 py-4 text-center text-lg font-medium leading-6  focus:outline-none focus:ring-2 focus:ring-offset-2",
									planId === currentSubscriptionId
										? "cursor-default border-indigo-700 text-indigo-600"
										: "cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
									loadingProMonthly ? "cursor-not-allowed opacity-50" : null
								)}
								onClick={
									planId === currentSubscriptionId
										? () => {}
										: () => {
												setPlanId(planId);
												setPlanName(planName);
												setShowModal(true);
										  }
								}
							>
								{planId === currentSubscriptionId
									? currentPlanText
									: loadingProMonthly
									? processingPlanText
									: selectPlanText}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : planName === "agency" ? (
		<div className="mx-auto mt-10 max-w-md lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3 lg:m-0 lg:max-w-none">
			<div className="flex h-full flex-col overflow-hidden rounded-lg border shadow-lg lg:rounded-none lg:rounded-r-lg">
				<div className="flex flex-1 flex-col">
					<div className="bg-white px-6 py-10">
						<div>
							<h3 className="text-center text-2xl font-medium leading-8 text-gray-900" id="tier-scale">
								{planNameTitle}
								<span className="text-red-400">*</span>
							</h3>
							<div className="mt-4 flex items-center justify-center">
								<span className="flex items-start px-3 text-6xl leading-none tracking-tight text-gray-900">
									<span className="mt-2 mr-2 text-4xl font-medium">$</span>
									<span className="font-bold">{planPrice}</span>
								</span>
								<span className="text-xl font-medium leading-7 text-gray-500">{"/" + monthlyText}</span>
							</div>
						</div>
					</div>
					<div className="flex flex-1 flex-col justify-between border-t border-gray-300 bg-white p-6 sm:p-10 lg:p-6 xl:p-10">
						{planFeatures ? (
							<ul>
								{planFeatures.map((val2, key) => {
									return (
										<li key={key} className="my-3 flex items-start">
											<div className="flex-shrink-0">
												<CheckIcon className="h-5 w-5 text-green-500" />
											</div>
											<p className="ml-3 text-base font-medium leading-6 text-gray-500">{val2}</p>
										</li>
									);
								})}
							</ul>
						) : null}

						<div className="mt-8">
							<div className={classnames("rounded-lg", planId === currentSubscriptionId ? "shadow-none" : "shadow-sm")}>
								{planId === currentSubscriptionId &&
								sanitizedCurrentSubscriptionStatus === "paid" &&
								currentSubscriptionCancelAt?.length > 0 ? (
									<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
										<span className="px-2 py-5 text-center text-gray-600">
											<p className="text-sm font-medium">{endsOnText}</p>
											<p className="text-xs text-gray-500">
												{!disableLocalTime
													? dayjs(currentSubscriptionCancelAt).calendar(null, calendarStrings)
													: dayjs.utc(currentSubscriptionCancelAt).calendar(null, calendarStrings)}
												<span className="ml-1 font-medium">({!disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
											</p>
										</span>
									</div>
								) : null}

								<button
									type="button"
									disabled={planId === currentSubscriptionId}
									aria-disabled={planId === currentSubscriptionId}
									aria-hidden={planId === currentSubscriptionId}
									className={classnames(
										"block w-full rounded-lg border border-transparent px-6 py-4 text-center text-lg font-medium leading-6  focus:outline-none focus:ring-2 focus:ring-offset-2",
										planId === currentSubscriptionId
											? "cursor-default border-indigo-700 text-indigo-600"
											: "cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
										loadingAgencyMonthly ? "cursor-not-allowed opacity-50" : null
									)}
									onClick={
										planId === currentSubscriptionId
											? () => {}
											: () => {
													setPlanId(planId);
													setPlanName(planName);
													setShowModal(true);
											  }
									}
								>
									{planId === currentSubscriptionId
										? currentPlanText
										: loadingAgencyMonthly
										? processingPlanText
										: selectPlanText}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : null;
};

MonthlyPlans.propTypes = {
	data: PropTypes.shape({
		features: PropTypes.array,
		id: PropTypes.number,
		plan: PropTypes.shape({
			name: PropTypes.string
		}),
		price: PropTypes.shape({
			unit_amount: PropTypes.number
		})
	}),
	disableLocalTime: PropTypes.bool,
	loadingAgencyMonthly: PropTypes.bool,
	loadingProMonthly: PropTypes.bool,
	setPlanId: PropTypes.func,
	setPlanName: PropTypes.func,
	setShowModal: PropTypes.func
};

/**
 * Memoized custom "MonthlyPlans" component
 */
export const MemoizedMonthlyPlans = memo(MonthlyPlans);
