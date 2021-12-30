import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { handleUnitAmountToRealPrice } from "@helpers/handleUnitAmountToRealPrice";
import { CheckIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `MonthlyPlans` component
 */
export function MonthlyPlans(props) {
	// Props
	const {
		data,
		defaultSubscription,
		disableLocalTime,
		loadingAgencyMonthly,
		loadingProMonthly,
		setShowModal,
		setPlanId,
		setPlanName
	} = props;

	// Translation
	const { t } = useTranslation();
	const subscriptionPlansMonthly = t("settings:subscriptionPlans.monthly");
	const subscriptionPlansSelectPlan = t("settings:subscriptionPlans.plan.select");
	const subscriptionPlansCurrentPlan = t("settings:subscriptionPlans.plan.current");
	const subscriptionPlansMostPopular = t("settings:subscriptionPlans.mostPopular");
	const subscriptionPlansProcessingPlan = t("settings:subscriptionPlans.processingPlan");
	const subscriptionPlansEndsOn = t("settings:subscriptionPlans.endsOn");

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
	const planName = handleStringToLowerCase(data?.plan?.name ?? null);
	const planNameTitle = data?.plan?.name ?? null;
	const planPrice = handleUnitAmountToRealPrice(data?.price?.unit_amount ?? null);
	const planFeatures = data?.features ?? null;
	const defaultSubscriptionId = defaultSubscription?.id ?? null;
	const defaultSubscriptionStatus = defaultSubscription?.status ?? null;
	const defaultSubscriptionCancelAt = defaultSubscription?.cancel_at ?? null;

	return planName === "pro" ? (
		<div tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4">
			<div tw="relative rounded-lg shadow-xl">
				<div tw="pointer-events-none absolute inset-0 rounded-lg border border-indigo-600"></div>
				<div tw="absolute inset-x-0 top-0 transform translate-y-px">
					<div tw="flex justify-center transform -translate-y-1/2">
						<span tw="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white">
							{subscriptionPlansMostPopular}
						</span>
					</div>
				</div>
				<div tw="bg-white rounded-t-lg px-6 pt-12 pb-10">
					<div>
						<h3 tw="text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6" id="tier-growth">
							{planNameTitle}
							<span tw="text-red-400">*</span>
						</h3>
						<div tw="mt-4 flex items-center justify-center">
							<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl">
								<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
								<span tw="font-bold">{planPrice}</span>
							</span>
							<span tw="text-2xl leading-8 font-medium text-gray-500">{"/" + subscriptionPlansMonthly}</span>
						</div>
					</div>
				</div>
				<div tw="border-t border-gray-300 rounded-b-lg pt-10 pb-8 px-6 bg-white sm:px-10 sm:py-10">
					<ul>
						{planFeatures?.map((val2, key) => {
							return (
								<li key={key} tw="flex items-start my-3">
									<div tw="flex-shrink-0">
										<CheckIcon tw="h-6 w-6 text-green-500" />
									</div>
									<p tw="ml-3 text-base leading-6 font-medium text-gray-500">{val2}</p>
								</li>
							);
						}) ?? null}
					</ul>
					<div tw="mt-10">
						<div css={[tw`rounded-lg`, planId === defaultSubscriptionId ? tw`shadow-none` : tw`shadow-sm`]}>
							{planId === defaultSubscriptionId &&
							defaultSubscriptionStatus === "PAID" &&
							defaultSubscriptionCancelAt !== null ? (
								<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
									<span tw="px-2 py-5 text-gray-600 text-center">
										<p tw="text-sm font-medium">{subscriptionPlansEndsOn}</p>
										<p tw="text-xs text-gray-500">
											{!disableLocalTime
												? dayjs(defaultSubscriptionCancelAt).calendar(null, calendarStrings)
												: dayjs.utc(defaultSubscriptionCancelAt).calendar(null, calendarStrings)}
											<span tw="ml-1 font-medium">({!disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
										</p>
									</span>
								</div>
							) : null}

							<button
								type="button"
								disabled={planId === defaultSubscriptionId ? true : false}
								css={[
									tw`block w-full text-center rounded-lg border px-6 py-4 text-lg leading-6 font-medium border-transparent text-white focus:outline-none focus:ring-2 focus:ring-offset-2`,
									planId === defaultSubscriptionId
										? loadingProMonthly
											? tw`opacity-50 cursor-not-allowed bg-indigo-600`
											: tw`cursor-default text-indigo-600 border-indigo-700`
										: tw`cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`
								]}
								onClick={() => {
									setPlanId(planId);
									setPlanName(planName);
									setShowModal(true);
								}}
							>
								{planId === defaultSubscriptionId
									? subscriptionPlansCurrentPlan
									: loadingProMonthly
									? subscriptionPlansProcessingPlan
									: subscriptionPlansSelectPlan}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<div tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3">
			<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg border">
				<div tw="flex-1 flex flex-col">
					<div tw="bg-white px-6 py-10">
						<div>
							<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale">
								{planNameTitle}
								<span tw="text-red-400">*</span>
							</h3>
							<div tw="mt-4 flex items-center justify-center">
								<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
									<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
									<span tw="font-bold">{planPrice}</span>
								</span>
								<span tw="text-xl leading-7 font-medium text-gray-500">{"/" + subscriptionPlansMonthly}</span>
							</div>
						</div>
					</div>
					<div tw="flex-1 flex flex-col justify-between border-t border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10">
						<ul>
							{planFeatures?.map((val2, key) => {
								return (
									<li key={key} tw="flex items-start my-3">
										<div tw="flex-shrink-0">
											<CheckIcon tw="h-6 w-6 text-green-500" />
										</div>
										<p tw="ml-3 text-base leading-6 font-medium text-gray-500">{val2}</p>
									</li>
								);
							})}
						</ul>
						<div tw="mt-8">
							<div css={[tw`rounded-lg`, planId === defaultSubscriptionId ? tw`shadow-none` : tw`shadow-sm`]}>
								{planId === defaultSubscriptionId &&
								defaultSubscriptionStatus === "PAID" &&
								defaultSubscriptionCancelAt !== null ? (
									<div tw="relative flex justify-center flex-wrap flex-row text-sm leading-5">
										<span tw="px-2 py-5 text-gray-600 text-center">
											<p tw="text-sm font-medium">{subscriptionPlansEndsOn}</p>
											<p tw="text-xs text-gray-500">
												{!disableLocalTime
													? dayjs(defaultSubscriptionCancelAt).calendar(null, calendarStrings)
													: dayjs.utc(defaultSubscriptionCancelAt).calendar(null, calendarStrings)}
												<span tw="ml-1 font-medium">({!disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
											</p>
										</span>
									</div>
								) : null}

								<button
									type="button"
									disabled={planId === defaultSubscriptionId ? true : false}
									css={[
										tw`block w-full text-center rounded-lg border px-6 py-4 text-lg leading-6 font-medium border-transparent text-white focus:outline-none focus:ring-2 focus:ring-offset-2`,
										planId === defaultSubscriptionId
											? loadingAgencyMonthly
												? tw`opacity-50 cursor-not-allowed bg-indigo-600`
												: tw`cursor-default text-indigo-600 border-indigo-700`
											: tw`cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`
									]}
									onClick={() => {
										setPlanId(planId);
										setPlanName(planName);
										setShowModal(true);
									}}
								>
									{planId === defaultSubscriptionId
										? subscriptionPlansCurrentPlan
										: loadingAgencyMonthly
										? subscriptionPlansProcessingPlan
										: subscriptionPlansSelectPlan}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

MonthlyPlans.propTypes = {
	data: PropTypes.shape({
		features: PropTypes.array,
		id: PropTypes.number.isRequired,
		plan: PropTypes.shape({
			name: PropTypes.string.isRequired
		}),
		price: PropTypes.shape({
			unit_amount: PropTypes.number.isRequired
		})
	}),
	defaultSubscription: PropTypes.shape({
		cancel_at: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		status: PropTypes.string.isRequired
	}),
	disableLocalTime: PropTypes.bool.isRequired,
	loadingAgencyMonthly: PropTypes.bool.isRequired,
	loadingProMonthly: PropTypes.bool.isRequired,
	setPlanId: PropTypes.func.isRequired,
	setPlanName: PropTypes.func.isRequired,
	setShowModal: PropTypes.func.isRequired
};

/**
 * Memoized custom `MonthlyPlans` component
 */
export const MemoizedMonthlyPlans = memo(MonthlyPlans);
