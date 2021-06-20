// External
import { CheckIcon, ExclamationIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Components
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

const BasicPlan = ({
	key,
	data,
	currentSubscription,
	currentPaymentMethod,
	subscriptionLabel,
	paymentMethodFormLabel,
	showChangeToBasicModal,
	setShowChangeToBasicModal,
	basicPlanId,
	setBasicPlanId,
	basicPlanName,
	setBasicPlanName,
	loadingBasic,
	setLoadingBasic,
	successMsg,
	successMsgLoaded,
	setSuccessMsgLoaded,
	errorMsg,
	errorMsgLoaded,
	setErrorMsgLoaded,
	handleSelectPlan
}) => {
	return (
		<>
			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={paymentMethodFormLabel[6].label}
			/>
			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={paymentMethodFormLabel[7].label}
			/>
			<Transition show={showChangeToBasicModal} tw="fixed z-50 inset-0 overflow-y-auto">
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						tw="fixed inset-0 transition-opacity"
					>
						<div aria-hidden="true">
							<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>
					</Transition.Child>

					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

					<Transition.Child
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						tw="inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6"
					>
						<div role="dialog" aria-modal="true" aria-labelledby="modal-headline">
							<div tw="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mb-3">
								<ExclamationIcon tw="h-6 w-6 text-red-600" />
							</div>
							<div tw="text-center">
								<h2 tw="mb-6 text-xl leading-6 font-semibold text-gray-900" id="modal-headline">
									{subscriptionLabel[15].label}
								</h2>
								<p tw="mb-8 text-sm leading-5 font-normal">{subscriptionLabel[15].description}</p>

								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 mb-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm sm:text-sm sm:leading-5 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									aria-label="Downgrade to Basic"
									onClick={() =>
										setTimeout(() => {
											handleSelectPlan(basicPlanId, basicPlanName, currentPaymentMethod);
										}, 150)
									}
								>
									{subscriptionLabel[16].label}
								</button>
								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									aria-label="Cancel Downgrade to Basic"
									onClick={() =>
										setTimeout(() => {
											setShowChangeToBasicModal(!showChangeToBasicModal);
										}, 150)
									}
								>
									{subscriptionLabel[10].label}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>
			<div
				key={key}
				tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3"
			>
				<div tw="h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg border">
					<div tw="flex-1 flex flex-col">
						<div tw="bg-white px-6 py-10">
							<div>
								<h3 tw="text-center text-2xl leading-8 font-medium text-gray-900" id="tier-hobby">
									{data.group.name}
								</h3>
								<div tw="mt-4 flex items-center justify-center">
									<span tw="px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900">
										<span tw="mt-2 mr-2 text-4xl font-medium">$</span>
										<span tw="font-bold">{data.price.unit_amount / 100}</span>
									</span>
									<span tw="text-xl leading-7 font-medium text-gray-500">{subscriptionLabel[22].label}</span>
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
								<div
									css={[
										tw`rounded-lg`,
										data.id === currentSubscription.id || currentSubscription.id === null
											? tw`shadow-none`
											: tw`shadow-sm`
									]}
								>
									{data.id === currentSubscription.id || currentSubscription.id === null ? (
										<button tw="block w-full text-center rounded-lg border border-transparent bg-white px-6 py-4 text-xl leading-6 font-medium text-indigo-600 border-indigo-700 cursor-not-allowed focus:outline-none">
											{subscriptionLabel[4].label}
										</button>
									) : (
										<button
											tw="block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg leading-6 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											onClick={() =>
												setTimeout(() => {
													setShowChangeToBasicModal(!showChangeToBasicModal);
													setBasicPlanId(data.id);
													setBasicPlanName(data.group.name);
													setLoadingBasic(!loadingBasic);
												}, 150)
											}
										>
											{loadingBasic ? "Processing Plan..." : subscriptionLabel[3].label}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

BasicPlan.propTypes = {};

export default BasicPlan;
