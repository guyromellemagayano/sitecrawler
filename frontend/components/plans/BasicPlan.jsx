import { handleUnitAmountToRealPrice } from "@helpers/handleUnitAmountToRealPrice";
import { CheckIcon } from "@heroicons/react/solid";
import { useCurrentSubscription } from "@hooks/useCurrentSubscription";
import { classnames } from "@utils/classnames";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";

/**
 * Custom function to render the `BasicPlan` component
 *
 * @param {object} data
 * @param {function} setPlanId
 * @param {function} setPlanName
 * @param {function} setOpen
 */
const BasicPlan = ({ data = null, setPlanId, setPlanName, setOpen }) => {
	const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
	const [currentSubscriptionCancelAt, setCurrentSubscriptionCancelAt] = useState(null);

	// Translation
	const { t } = useTranslation();
	const subscriptionPlansMonthly = t("settings:subscriptionPlans.monthly");
	const subscriptionPlansSelectPlan = t("settings:subscriptionPlans.plan.select");
	const subscriptionPlansCurrentPlan = t("settings:subscriptionPlans.plan.current");
	const subscriptionPlansRequested = t("settings:subscriptionPlans.requested");

	// SWR hooks
	const { currentSubscription, errorCurrentSubscription, validatingCurrentSubscription } = useCurrentSubscription();

	// Custom variables
	const planId = data?.id ?? null;
	const planName = handleConversionStringToLowercase(data?.plan?.name ?? null);
	const planNameTitle = data?.plan?.name ?? null;
	const planPrice = handleUnitAmountToRealPrice(data?.price?.unit_amount ?? null);
	const planFeatures = data?.features ?? null;

	// Handle current subscription
	const handleCurrentSubscription = useCallback(async () => {
		if (!validatingCurrentSubscription) {
			if (!errorCurrentSubscription && typeof currentSubscription !== "undefined" && currentSubscription !== null) {
				setCurrentSubscriptionId(currentSubscription?.id ?? null);
				setCurrentSubscriptionCancelAt(currentSubscription?.cancel_at ?? null);
			}
		}
	}, [currentSubscription, errorCurrentSubscription, validatingCurrentSubscription]);

	useEffect(() => {
		handleCurrentSubscription();
	}, [handleCurrentSubscription]);

	return (
		<div className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none">
			<div className="flex h-full flex-col overflow-hidden rounded-lg border shadow-lg lg:rounded-none lg:rounded-l-lg">
				<div className="flex flex-1 flex-col">
					<div className="bg-white px-6 py-10">
						<div>
							<h3 className="text-center text-2xl font-medium leading-8 text-gray-900" id="tier-hobby">
								{planNameTitle}
							</h3>
							<div className="mt-4 flex items-center justify-center">
								<span className="flex items-start px-3 text-6xl leading-none tracking-tight text-gray-900">
									<span className="mt-2 mr-2 text-4xl font-medium">{"$"}</span>
									<span className="font-bold">{planPrice}</span>
								</span>
								<span className="text-xl font-medium leading-7 text-gray-500">{"/" + subscriptionPlansMonthly}</span>
							</div>
						</div>
					</div>
					<div className="flex flex-1 flex-col justify-between border-t border-gray-300 bg-white p-6 sm:p-10 lg:p-6 xl:p-10">
						<ul>
							{planFeatures?.map((val2, key) => {
								return (
									<li key={key} className="my-3 flex items-start">
										<div className="flex-shrink-0">
											<CheckIcon className="h-5 w-5 text-green-500" />
										</div>
										<p className="ml-3 text-base font-medium leading-6 text-gray-500">{val2}</p>
									</li>
								);
							}) ?? null}
						</ul>
						<div className="mt-8">
							<div
								className={classnames(
									"rounded-lg",
									planName === "basic" && currentSubscriptionId == null ? "shadow-none" : "shadow-sm"
								)}
							>
								<button
									type="button"
									disabled={planName === "basic" && currentSubscriptionId == null ? true : false}
									className={classnames(
										"block w-full rounded-lg border border-transparent px-6 py-4 text-center text-lg font-medium leading-6 text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
										planName === "basic" && currentSubscriptionId == null
											? currentSubscriptionCancelAt == null
												? "cursor-default border-indigo-700 text-indigo-600"
												: "cursor-default bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
											: "cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
									)}
									onClick={() => {
										setPlanId(planId);
										setPlanName(planName);
										setOpen(true);
									}}
								>
									{planId === "basic" && currentSubscriptionId == null
										? subscriptionPlansCurrentPlan
										: currentSubscriptionCancelAt !== null
										? subscriptionPlansRequested
										: subscriptionPlansSelectPlan}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

BasicPlan.propTypes = {
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
	setPlanId: PropTypes.func,
	setPlanName: PropTypes.func,
	setOpen: PropTypes.func
};

/**
 * Memoized custom `BasicPlan` component
 */
export const MemoizedBasicPlan = memo(BasicPlan);
