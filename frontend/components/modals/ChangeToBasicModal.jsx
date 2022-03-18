import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo, useContext, useRef } from "react";

/**
 * Custom function to render the `ChangeToBasicModal` component
 *
 * @param {function} handlePlanSelect
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} showModal
 * @param {function} setShowModal
 * @param {boolean} isProcessingPayment
 */
const ChangeToBasicModal = (
	{ handlePlanSelect, planId = null, planName = null, showModal = false, setShowModal, isProcessingPayment = false },
	ref
) => {
	// Translation
	const { t } = useTranslation();
	const downgradeToBasicLabelText = t("settings:subscriptionPlans.downgradeToBasicPlan.label");
	const downgradeToBasicDescriptionText = t("settings:subscriptionPlans.downgradeToBasicPlan.description");
	const closeText = t("common:close");
	const cancelText = t("common:cancel");
	const subscriptionPlansProcessingPayment = t("settings:subscriptionPlans.processingPayment");
	const downgradePlanText = t("common:downgradePlan");

	// Custom context
	const { defaultPaymentMethod } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const defaultPaymentMethodId = defaultPaymentMethod?.data?.id ?? null;

	// Custom hooks
	const changeToBasicRef = useRef(null);

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={changeToBasicRef}
				onClose={isProcessingPayment ? () => {} : handleCloseModal}
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
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
									<ExclamationIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
										{downgradeToBasicLabelText}
									</Dialog.Title>

									<div className="my-2">
										<Dialog.Description as="p" className="mb-3 text-sm text-gray-500">
											{downgradeToBasicDescriptionText}
										</Dialog.Description>
									</div>
								</div>
							</div>

							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								{defaultPaymentMethodId ? (
									<button
										ref={changeToBasicRef}
										type="button"
										disabled={isProcessingPayment}
										aria-disabled={isProcessingPayment}
										aria-hidden={isProcessingPayment}
										className={classnames(
											"inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm",
											isProcessingPayment
												? "cursor-not-allowed opacity-50"
												: "hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
										)}
										onClick={isProcessingPayment ? () => {} : () => handlePlanSelect(planId, planName)}
									>
										{isProcessingPayment ? subscriptionPlansProcessingPayment : downgradePlanText}
									</button>
								) : null}

								<button
									type="button"
									disabled={isProcessingPayment}
									aria-disabled={isProcessingPayment}
									aria-hidden={isProcessingPayment}
									className={classnames(
										"mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm sm:mt-0 sm:w-auto sm:text-sm",
										isProcessingPayment
											? "cursor-not-allowed opacity-50"
											: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
									)}
									onClick={isProcessingPayment ? () => {} : handleCloseModal}
								>
									{closeText}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `ChangeToBasicModal` component
 */
const ForwardRefChangeToBasicModal = forwardRef(ChangeToBasicModal);
export const MemoizedChangeToBasicModal = memo(ForwardRefChangeToBasicModal);
