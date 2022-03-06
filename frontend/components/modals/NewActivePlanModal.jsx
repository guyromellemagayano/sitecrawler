import { AppLogo } from "@components/logos/AppLogo";
import { BadgeModalImage, SubscriptionSuccessBadge } from "@constants/GlobalValues";
import { Transition } from "@headlessui/react";
import { CheckIcon, XIcon } from "@heroicons/react/solid";
import { useSubscriptions } from "@hooks/useSubscriptions";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, memo } from "react";
import { styled } from "styled-components";

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
			<div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="change-to-basic-modal-first-child-enter"
					enterFrom="change-to-basic-modal-first-child-enter-from"
					enterTo="change-to-basic-modal-first-child-enter-to"
					leave="change-to-basic-modal-first-child-leave"
					leaveFrom="change-to-basic-modal-first-child-leave-from"
					leaveTo="change-to-basic-modal-first-child-leave-to"
				>
					<div className="fixed inset-0 transition-opacity" aria-hidden="true">
						<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>

				<span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

				<Transition.Child
					enter="change-to-basic-modal-second-child-enter"
					enterFrom="change-to-basic-modal-second-child-enter-from"
					enterTo="change-to-basic-modal-second-child-enter-to"
					leave="change-to-basic-modal-second-child-leave"
					leaveFrom="change-to-basic-modal-second-child-leave-from"
					leaveTo="change-to-basic-modal-second-child-leave-to"
				>
					<div
						ref={ref}
						className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-3 pb-4 text-left align-bottom shadow-xl transition-all sm:mx-auto sm:my-8 sm:w-full sm:max-w-xl sm:p-6 sm:align-middle lg:p-0"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<ConfettiBgImgSpan />

						<div className="absolute top-0 right-0 z-50 hidden pt-4 pr-4 sm:block">
							<button
								type="button"
								className="text-gray-400 hover:text-gray-500 focus:text-gray-500 focus:outline-none"
								aria-label="Close"
								onClick={() => setShowModal(false)}
							>
								<XIcon className="h-5 w-5" />
							</button>
						</div>
						<div>
							<AppLogo
								className="mx-auto mt-12 mb-14 inline-flex w-full justify-center"
								src={SubscriptionSuccessBadge}
								alt={BadgeModalImage.alt}
								width={BadgeModalImage.width}
								height={BadgeModalImage.height}
							/>

							<div className="text-center sm:mt-3">
								<h2 className="mb-3 text-3xl font-bold leading-6 text-gray-900" id="modal-headline">
									{subscriptionPlansCongratulations}
								</h2>
								<p className="mb-6 text-base font-semibold leading-6">Your {planName} plan is now active.</p>
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
															className="mx-auto max-w-md lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 lg:mx-0 lg:max-w-none"
														>
															<div className="flex h-full flex-col">
																<div className="flex flex-1 flex-col">
																	<div className="flex flex-1 flex-col justify-between bg-white p-6 sm:p-10 lg:p-6 xl:p-6">
																		<ul className="mb-6 grid grid-cols-2">
																			{val.features.map((val2, key) => {
																				return (
																					<li key={key} className="my-1 flex items-start">
																						<div className="flex-shrink-0">
																							<CheckIcon className="h-5 w-5 text-green-500" />
																						</div>
																						<p className="ml-3 text-sm font-medium leading-6 text-gray-500">{val2}</p>
																					</li>
																				);
																			})}
																		</ul>

																		<button
																			type="button"
																			className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium leading-6 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm sm:leading-5"
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

/**
 * Memoized custom `NewActivePlanModal` component
 */
const ForwardRefNewActivePlanModal = forwardRef(NewActivePlanModal);
export const MemoizedNewActivePlanModal = memo(ForwardRefNewActivePlanModal);
