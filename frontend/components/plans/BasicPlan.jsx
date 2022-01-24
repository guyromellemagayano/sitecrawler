import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { handleUnitAmountToRealPrice } from "@helpers/handleUnitAmountToRealPrice";
import { CheckIcon } from "@heroicons/react/solid";
import { useCurrentSubscription } from "@hooks/useCurrentSubscription";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `BasicPlan` component
 */
export function BasicPlan(props) {
	const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
	const [currentSubscriptionCancelAt, setCurrentSubscriptionCancelAt] = useState(null);

	// Props
	const { data, setPlanId, setPlanName, setOpen } = props;

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
	const planName = handleStringToLowerCase(data?.plan?.name ?? null);
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
		<div tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
			<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg border">
				<div tw="flex-1 flex flex-col">
					<div tw="bg-white px-6 py-10">
						<div>
							<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-hobby">
								{planNameTitle}
							</h3>
							<div tw="mt-4 flex items-center justify-center">
								<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
									<span tw="mt-2 mr-2 text-4xl font-medium">{"$"}</span>
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
							}) ?? null}
						</ul>
						<div tw="mt-8">
							<div
								css={[
									tw`rounded-lg`,
									planName === "basic" && currentSubscriptionId == null ? tw`shadow-none` : tw`shadow-sm`
								]}
							>
								<button
									type="button"
									disabled={planName === "basic" && currentSubscriptionId == null ? true : false}
									css={[
										tw`block w-full text-center rounded-lg border px-6 py-4 text-lg leading-6 font-medium border-transparent text-white focus:outline-none focus:ring-2 focus:ring-offset-2`,
										planName === "basic" && currentSubscriptionId == null
											? currentSubscriptionCancelAt == null
												? tw`cursor-default text-indigo-600 border-indigo-700`
												: tw`cursor-default bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`
											: tw`cursor-pointer bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500`
									]}
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
}

BasicPlan.propTypes = {
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
	setPlanId: PropTypes.func.isRequired,
	setPlanName: PropTypes.func.isRequired,
	setOpen: PropTypes.func.isRequired
};

/**
 * Memoized custom `BasicPlan` component
 */
export const MemoizedBasicPlan = memo(BasicPlan);
