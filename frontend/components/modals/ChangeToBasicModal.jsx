import { Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, memo } from "react";

/**
 * Custom function to render the `ChangeToBasicModal` component
 *
 * @param {number} planId
 * @param {string} planName
 * @param {object} defaultPaymentMethod
 * @param {boolean} disableDowngradeToBasicPlan
 * @param {function} handlePlanSelect
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const ChangeToBasicModal = (
	{
		planId = null,
		planName = null,
		defaultPaymentMethod = null,
		disableDowngradeToBasicPlan = false,
		handlePlanSelect,
		showModal = false,
		setShowModal
	},
	ref
) => {
	// Translation
	const { t } = useTranslation();
	const subscriptionPlansDowngradeToBasicLabel = t("settings:subscriptionPlans.downgradeToBasicPlan.label");
	const subscriptionPlansDowngradeToBasicDescription = t("settings:subscriptionPlans.downgradeToBasicPlan.description");
	const processing = t("common:processing");
	const close = t("common:close");
	const proceed = t("common:proceed");

	// Handle plan selection
	const handlePlanSelection = async (id, name, method) => {
		handlePlanSelect(id, name, method);
		setShowModal(false);
	};

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
						className="transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 transition-all sm:w-full sm:max-w-lg sm:p-6"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div className="sm:flex sm:items-start">
							<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
								<ExclamationIcon className="h-6 w-6 text-yellow-600" />
							</div>
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
									{subscriptionPlansDowngradeToBasicLabel}
								</h3>
								<div className="my-2">
									<p className="text-sm leading-5 text-gray-500">{subscriptionPlansDowngradeToBasicDescription}</p>
								</div>
							</div>
						</div>

						<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
							<span className="flex w-full sm:w-auto">
								<button
									type="button"
									disabled={disableDowngradeToBasicPlan}
									className={classnames(
										"inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-yellow-600 px-4 py-2 text-sm font-medium leading-5 text-white shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:ml-3 sm:text-sm sm:leading-5",
										disableDowngradeToBasicPlan
											? "cursor-not-allowed opacity-50"
											: "hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 active:bg-yellow-700"
									)}
									aria-label="Downgrade to Basic Plan"
									onClick={handlePlanSelection(planId, planName, defaultPaymentMethod)}
								>
									{disableDowngradeToBasicPlan ? processing : proceed}
								</button>

								<button
									type="button"
									className={classnames(
										"inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 shadow-sm sm:ml-3 sm:text-sm sm:leading-5",
										disableDowngradeToBasicPlan
											? "cursor-not-allowed opacity-50"
											: "transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
									)}
									onClick={() => setShowModal(false)}
								>
									{close}
								</button>
							</span>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

ChangeToBasicModal.propTypes = {
	defaultPaymentMethod: PropTypes.object,
	disableDowngradeToBasicPlan: PropTypes.bool,
	handlePlanSelect: PropTypes.func,
	planId: PropTypes.number,
	planName: PropTypes.string,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool
};

/**
 * Memoized custom `ChangeToBasicModal` component
 */
const ForwardRefChangeToBasicModal = forwardRef(ChangeToBasicModal);
export const MemoizedChangeToBasicModal = memo(ForwardRefChangeToBasicModal);
