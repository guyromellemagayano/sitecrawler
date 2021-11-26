import { SubscriptionLabels } from "@enums/SubscriptionLabels";
import { SubscriptionPlanLabels } from "@enums/SubscriptionPlanLabels";
import { CheckIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import tw from "twin.macro";

const BasicPlan = ({ data, defaultSubscription, setBasicPlanId, setBasicPlanName, setShowModal, showModal }) => {
	return (
		<div tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3">
			<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg border">
				<div tw="flex-1 flex flex-col">
					<div tw="bg-white px-6 py-10">
						<div>
							<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-hobby">
								{data?.plan?.name}
							</h3>
							<div tw="mt-4 flex items-center justify-center">
								<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
									<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
									<span tw="font-bold">{data?.price?.unit_amount / 100}</span>
								</span>
								<span tw="text-xl leading-7 font-medium text-gray-500">{SubscriptionLabels[22].label}</span>
							</div>
						</div>
					</div>
					<div tw="flex-1 flex flex-col justify-between border-t border-gray-300 p-6 bg-white sm:p-10 lg:p-6 xl:p-10">
						<ul>
							{data?.features.map((val2, key) => {
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
							<div css={[tw`rounded-lg`, defaultSubscription?.cancel_at !== null ? tw`shadow-none` : tw`shadow-sm`]}>
								{defaultSubscription?.cancel_at !== undefined && defaultSubscription?.cancel_at !== null ? (
									<button
										type="button"
										disabled={true}
										tw="block w-full text-center rounded-lg border bg-white px-6 py-4 text-xl leading-6 font-medium text-yellow-600 border-yellow-700 cursor-not-allowed focus:outline-none"
									>
										{SubscriptionPlanLabels[3].label}
									</button>
								) : (
									<button
										type="button"
										css={[
											tw`block w-full text-center rounded-lg border px-6 py-4 text-lg leading-6 font-medium `,
											data?.id === defaultSubscription?.id && defaultSubscription?.cancel_at == null
												? tw`text-indigo-600 border-indigo-700`
												: tw`border-transparent text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
										]}
										onClick={() =>
											(() => {
												setBasicPlanId(data?.id);
												setBasicPlanName(data?.plan?.name);
												setShowModal(!showModal);
											})()
										}
									>
										{data?.id === defaultSubscription?.id && defaultSubscription?.cancel_at == null
											? SubscriptionLabels[4].label
											: SubscriptionLabels[3].label}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

BasicPlan.propTypes = {
	cancel_at: PropTypes.string,
	componentReady: PropTypes.bool,
	features: PropTypes.array,
	id: PropTypes.number,
	name: PropTypes.string,
	setBasicPlanId: PropTypes.func,
	setBasicPlanName: PropTypes.func,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool,
	unit_amount: PropTypes.number
};

BasicPlan.defaultProps = {
	cancel_at: null,
	componentReady: false,
	features: null,
	id: null,
	name: null,
	setBasicPlanId: null,
	setBasicPlanName: null,
	setShowModal: null,
	showModal: false,
	unit_amount: null
};

export default BasicPlan;
