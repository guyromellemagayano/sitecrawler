import { AppLogo } from "@components/logos/AppLogo";
import { BadgeModalImage, SubscriptionSuccessBadge } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useSubscriptions } from "@hooks/useSubscriptions";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, memo } from "react";
import { styled } from "twin.macro";

const ConfettiBgImgSpan = styled.span`
	background: url("/images/backgrounds/subscription-success-bg.png");
	background-size: cover;
	background-position: top center;
	background-repeat: no-repeat;
	min-height: 18rem;
	width: 100%;
	position: absolute;
	z-index: -1;
`;

/**
 * Custom function to render the `NewActivePlanModal` component
 *
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const NewActivePlanModal = ({ planId = null, planName = null, showModal = false, setShowModal }, ref) => {
	// Translation
	const { t } = useTranslation();
	const subscriptionPlansCongratulations = t("settings:subscriptionPlans.congratulations");
	const subscriptionPlansStartCrawling = t("settings:subscriptionPlans.startCrawling");

	// SWR hooks
	const { subscriptions, errorSubscriptions, validatingSubscriptions } = useSubscriptions();

	return (
		<Transition show={showModal}>
			<div tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="new-active-plan-modal-first-child-enter"
					enterFrom="new-active-plan-modal-first-child-enter-from"
					enterTo="new-active-plan-modal-first-child-enter-to"
					leave="new-active-plan-modal-first-child-leave"
					leaveFrom="new-active-plan-modal-first-child-leave-from"
					leaveTo="new-active-plan-modal-first-child-leave-to"
				>
					<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>

				<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

				<Transition.Child
					enter="new-active-plan-modal-second-child-enter"
					enterFrom="new-active-plan-modal-second-child-enter-from"
					enterTo="new-active-plan-modal-second-child-enter-to"
					leave="new-active-plan-modal-second-child-leave"
					leaveFrom="new-active-plan-modal-second-child-leave-from"
					leaveTo="new-active-plan-modal-second-child-leave-to"
				>
					<div
						ref={ref}
						tw="sm:w-full sm:max-w-xl sm:mx-auto inline-block align-bottom bg-white rounded-lg px-4 pt-3 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 lg:p-0"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<ConfettiBgImgSpan />

						<div tw="hidden sm:block absolute top-0 right-0 pt-4 pr-4 z-50">
							<button
								type="button"
								tw="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
								aria-label="Close"
								onClick={() => setShowModal(false)}
							>
								<XIcon tw="h-6 w-6" />
							</button>
						</div>
						<div>
							<AppLogo
								className="w-full inline-flex justify-center mx-auto mt-12 mb-14"
								src={SubscriptionSuccessBadge}
								alt={BadgeModalImage.alt}
								width={BadgeModalImage.width}
								height={BadgeModalImage.height}
							/>

							<div tw="text-center sm:mt-3">
								<h2 tw="mb-3 text-3xl leading-6 font-bold text-gray-900" id="modal-headline">
									{subscriptionPlansCongratulations}
								</h2>
								<p tw="mb-6 text-base leading-6 font-semibold">Your {planName} plan is now active.</p>
								{!validatingSubscriptions
									? !errorSubscriptions &&
									  typeof subscriptions !== "undefined" &&
									  subscriptions !== null &&
									  !subscriptions?.data?.detail
										? subscriptions?.results
												?.filter((result) => result.id === planId)
												?.map((val, key) => {
													return (
														<div
															key={key}
															tw="mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3"
														>
															<div tw="h-full flex flex-col">
																<div tw="flex-1 flex flex-col">
																	<div tw="flex-1 flex flex-col justify-between p-6 bg-white sm:p-10 lg:p-6 xl:p-6">
																		<ul tw="grid grid-cols-2 mb-6">
																			{val.features.map((val2, key) => {
																				return (
																					<li key={key} tw="flex items-start my-1">
																						<div tw="flex-shrink-0">
																							<CheckIcon tw="h-6 w-6 text-green-500" />
																						</div>
																						<p tw="ml-3 text-sm leading-6 font-medium text-gray-500">{val2}</p>
																					</li>
																				);
																			})}
																		</ul>

																		<button
																			type="button"
																			tw="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm sm:text-sm sm:leading-5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																			aria-label="Start Crawling"
																			onClick={() => setShowModal(false)}
																		>
																			{subscriptionPlansStartCrawling}
																		</button>
																	</div>
																</div>
															</div>
														</div>
													);
												}) ?? null
										: null
									: null}
							</div>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

NewActivePlanModal.propTypes = {
	planId: PropTypes.number,
	planName: PropTypes.string,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool
};

/**
 * Memoized custom `NewActivePlanModal` component
 */
export const ForwardRefNewActivePlanModal = forwardRef(NewActivePlanModal);
export const MemoizedNewActivePlanModal = memo(ForwardRefNewActivePlanModal);
