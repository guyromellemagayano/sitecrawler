import { Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, memo } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `ChangeToBasicModal` component
 */
export function ChangeToBasicModal(props, ref) {
	// Props
	const {
		planId,
		planName,
		defaultPaymentMethod,
		disableDowngradeToBasicPlan,
		handlePlanSelect,
		showModal,
		setShowModal
	} = props;

	// Translation
	const { t } = useTranslation();
	const subscriptionPlansDowngradeToBasicLabel = t("settings:subscriptionPlans.downgradeToBasicPlan.label");
	const subscriptionPlansDowngradeToBasicDescription = t("settings:subscriptionPlans.downgradeToBasicPlan.description");
	const processing = t("settings:processing");
	const close = t("common:close");
	const proceed = t("common:proceed");

	// Handle plan selection
	const handlePlanSelection = async (id, name, method) => {
		handlePlanSelect(id, name, method);
		setShowModal(false);
	};

	return (
		<Transition show={showModal} as="span">
			<div tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="change-to-basic-modal-first-child-enter"
					enterFrom="change-to-basic-modal-first-child-enter-from"
					enterTo="change-to-basic-modal-first-child-enter-to"
					leave="change-to-basic-modal-first-child-leave"
					leaveFrom="change-to-basic-modal-first-child-leave-from"
					leaveTo="change-to-basic-modal-first-child-leave-to"
				>
					<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>

				<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

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
						tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div tw="sm:flex sm:items-start">
							<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-yellow-100">
								<ExclamationIcon tw="h-6 w-6 text-yellow-600" />
							</div>
							<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
									{subscriptionPlansDowngradeToBasicLabel}
								</h3>
								<div tw="my-2">
									<p tw="text-sm leading-5 text-gray-500">{subscriptionPlansDowngradeToBasicDescription}</p>
								</div>
							</div>
						</div>

						<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
							<span tw="flex w-full sm:w-auto">
								<button
									type="button"
									disabled={disableDowngradeToBasicPlan}
									css={[
										tw`sm:ml-3 cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-yellow-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ease-in-out duration-150`,
										disableDowngradeToBasicPlan
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700`
									]}
									aria-label="Downgrade to Basic Plan"
									onClick={handlePlanSelection(planId, planName, defaultPaymentMethod)}
								>
									{disableDowngradeToBasicPlan ? processing : proceed}
								</button>

								<button
									type="button"
									css={[
										tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
										disableDowngradeToBasicPlan
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
									]}
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
}

/**
 * Memoized custom `ChangeToBasicModal` component
 */
export const ForwardRefChangeToBasicModal = forwardRef(ChangeToBasicModal);
export const MemoizedChangeToBasicModal = memo(ForwardRefChangeToBasicModal);
