// External
import { CheckIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import tw from "twin.macro";

const MonthlyPlans = ({
	key,
	data,
	currentSubscription,
	subscriptionLabel,
	currentPaymentMethod,
	loadingProMonthly,
	loadingAgencyMonthly,
	setUpdatedPlanId,
	setUpdatedPlanName,
	showPaymentFormModal,
	setShowPaymentFormModal
}) => {
	return data.group.name === "Pro" ? (
		<div
			key={key}
			tw="mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4"
		>
			<div tw="relative rounded-lg shadow-xl">
				<div tw="pointer-events-none absolute inset-0 rounded-lg border border-indigo-600"></div>
				<div tw="absolute inset-x-0 top-0 transform translate-y-px">
					<div tw="flex justify-center transform -translate-y-1/2">
						<span tw="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white">
							{subscriptionLabel[21].label}
						</span>
					</div>
				</div>
				<div tw="bg-white rounded-t-lg px-6 pt-12 pb-10">
					<div>
						<h3 tw="text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6" id="tier-growth">
							{data.group.name}
							<span tw="text-red-400">*</span>
						</h3>
						<div tw="mt-4 flex items-center justify-center">
							<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl">
								<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
								<span tw="font-bold">{data.price.unit_amount / 100}</span>
							</span>
							<span tw="text-2xl leading-8 font-medium text-gray-500">/month</span>
						</div>
					</div>
				</div>
				<div tw="border-t border-gray-300 rounded-b-lg pt-10 pb-8 px-6 bg-white sm:px-10 sm:py-10">
					<ul>
						{data.features.map((val2, key) => {
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
					<div tw="mt-10">
						<div css={[tw`rounded-lg`, data.id === currentSubscription.id ? tw`shadow-none` : tw`shadow-sm`]}>
							{data.id === currentSubscription.id ? (
								<button tw="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed focus:outline-none">
									{subscriptionLabel[4].label}
								</button>
							) : (
								<button
									type="button"
									css={[
										tw`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white`,
										!currentPaymentMethod || loadingProMonthly
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									disabled={!currentPaymentMethod || loadingProMonthly ? "disabled" : ""}
									onClick={() => {
										setTimeout(() => {
											setUpdatedPlanId(data.id);
											setUpdatedPlanName(data.group.name);
											setShowPaymentFormModal(!showPaymentFormModal);
										}, 150);
									}}
								>
									{loadingProMonthly ? "Processing Payment..." : subscriptionLabel[3].label}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : data.group.name === "Agency" ? (
		<div
			key={key}
			tw="mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3"
		>
			<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg border">
				<div tw="flex-1 flex flex-col">
					<div tw="bg-white px-6 py-10">
						<div>
							<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale">
								{data.group.name}
								<span tw="text-red-400">*</span>
							</h3>
							<div tw="mt-4 flex items-center justify-center">
								<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
									<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
									<span tw="font-bold">{data.price.unit_amount / 100}</span>
								</span>
								<span tw="text-xl leading-7 font-medium text-gray-500">/month</span>
							</div>
						</div>
					</div>
					<div tw="flex-1 flex flex-col justify-between border-t border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10">
						<ul>
							{data.features.map((val2, key) => {
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
							<div css={[tw`rounded-lg`, data.id === currentSubscription.id ? tw`shadow-none` : tw`shadow-sm`]}>
								{data.id === currentSubscription.id ? (
									<button tw="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed focus:outline-none">
										{subscriptionLabel[4].label}
									</button>
								) : (
									<button
										css={[
											tw`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white`,
											!currentPaymentMethod || loadingAgencyMonthly
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
										disabled={!currentPaymentMethod || loadingAgencyMonthly ? "disabled" : ""}
										onClick={() => {
											setTimeout(() => {
												setUpdatedPlanId(data.id);
												setUpdatedPlanName(data.group.name);
												setShowPaymentFormModal(!showPaymentFormModal);
											}, 150);
										}}
									>
										{loadingAgencyMonthly ? "Processing Payment..." : subscriptionLabel[3].label}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : null;
};

MonthlyPlans.propTypes = {};

export default MonthlyPlans;
