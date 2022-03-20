import { MemoizedAppLogo } from "@components/logos/AppLogo";
import { BadgeModalImage, Basic, SubscriptionSuccessBadge } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo, useContext, useRef } from "react";

/**
 * Custom function to render the `NewActivePlanModal` component
 *
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const NewActivePlanModal = ({ planId = null, planName = null, showModal = false, setShowModal }, ref) => {
	// Custom hooks
	const newActivePlanModalRef = useRef(null);

	// Translation
	const { t } = useTranslation();
	const congratulationsText = t("settings:subscriptionPlans.congratulations");
	const startCrawlingText = t("settings:subscriptionPlans.startCrawling");
	const planActiveText = t("settings:subscriptionPlans.planActive");
	const hasBeenRequestedText = t("settings:subscriptionPlans.hasBeenRequested");
	const currentPlan = t("settings:subscriptionPlans.plan.current");
	const currentPlanExpiresOnText = t("settings:subscriptionPlans.currentPlanExpiresOn");

	// Custom context
	const { subscriptions, currentSubscription, user } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const subscriptionsResults = subscriptions?.data?.results ?? null;
	const currentSubscriptionId = currentSubscription?.data?.id ?? null;
	const currentSubscriptionStatus = currentSubscription?.data?.status ?? null;
	const currentSubscriptionCancelAt = currentSubscription?.data?.cancel_at ?? null;
	const sanitizedCurrentSubscriptionStatus = currentSubscriptionStatus
		? handleConversionStringToLowercase(currentSubscriptionStatus)
		: null;
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;

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

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	// Handle current plan name
	const currentPlanName = subscriptionsResults?.find((sub) => sub.id === currentSubscriptionId)?.plan?.name ?? null;

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={newActivePlanModalRef}
				onClose={handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center p-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div
							className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-3 pb-4 text-left align-bottom shadow-xl transition-all sm:mx-auto sm:my-8 sm:w-full sm:max-w-xl sm:p-6 sm:align-middle lg:p-0"
							role="dialog"
							aria-modal="true"
							aria-labelledby="modal-headline"
						>
							<span className="confetti-bg-img" />

							<div className="mt-12 mb-14 flex w-full items-center justify-center">
								<MemoizedAppLogo
									src={SubscriptionSuccessBadge}
									alt={BadgeModalImage.alt}
									width={BadgeModalImage.width}
									height={BadgeModalImage.height}
								/>
							</div>

							<div className="text-center sm:mt-3">
								<h2 className="mb-3 text-3xl font-bold leading-6 text-gray-900" id="modal-headline">
									{congratulationsText}
								</h2>
								<p className="mb-6 text-base font-semibold leading-6">
									{planName === Basic ? planName + " " + hasBeenRequestedText : planName + " " + planActiveText}
								</p>

								{currentPlanName?.length > 0 &&
								sanitizedCurrentSubscriptionStatus === "paid" &&
								currentSubscriptionCancelAt?.length > 0 ? (
									<div className="relative flex flex-row flex-wrap justify-center text-sm leading-5">
										<span className="px-2 text-center text-gray-600">
											<span className="text-sm font-medium">{currentPlanName + " " + currentPlanExpiresOnText}</span>

											<p className="text-xs text-gray-500">
												{!disableLocalTime
													? dayjs(currentSubscriptionCancelAt).calendar(null, calendarStrings)
													: dayjs.utc(currentSubscriptionCancelAt).calendar(null, calendarStrings)}
												<span className="ml-1 font-medium">({!disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
											</p>
										</span>
									</div>
								) : null}

								{subscriptionsResults
									?.filter((result) => result.id === planId && result.plan.name === planName)
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
																ref={newActivePlanModalRef}
																type="button"
																className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium leading-6 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm sm:leading-5"
																onClick={handleCloseModal}
															>
																{startCrawlingText}
															</button>
														</div>
													</div>
												</div>
											</div>
										);
									}) ?? null}
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `NewActivePlanModal` component
 */
const ForwardRefNewActivePlanModal = forwardRef(NewActivePlanModal);
export const MemoizedNewActivePlanModal = memo(ForwardRefNewActivePlanModal);
