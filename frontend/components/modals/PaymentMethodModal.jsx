import { MemoizedPaymentMethodForm } from "@components/forms/PaymentMethodForm";
import { Dialog, Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useStripePromise } from "@hooks/useStripePromise";
import { Elements } from "@stripe/react-stripe-js";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, Fragment, memo } from "react";

/**
 * Custom function to render the `PaymentMethodModal` component
 *
 * @param {function} handlePlanSelect
 * @param {boolean} open
 * @param {function} setOpen
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} isProcessingPayment
 */
const PaymentMethodModal = (
	{ handlePlanSelect, open = false, setOpen, planId = null, planName = null, isProcessingPayment = false },
	ref
) => {
	// Translation
	const { t } = useTranslation();
	const subscriptionPlansUpgradePlanLabel = t("settings:subscriptionPlans.upgradePlan.label");
	const subscriptionPlansUpgradePlanDescription = t("settings:subscriptionPlans.upgradePlan.description");

	// SWR hooks
	const { stripePromise, errorStripePromise, validatingStripePromise, stripePromiseData } = useStripePromise();

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" initialFocus={ref} onClose={setOpen}>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
									<CreditCardIcon className="h-6 w-6 text-green-600" />
								</div>

								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
										{subscriptionPlansUpgradePlanLabel}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="mt-4 mb-3 text-sm text-gray-500">
											{subscriptionPlansUpgradePlanDescription}
										</Dialog.Description>
									</div>

									<div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
										<Elements stripe={stripePromiseData}>
											<MemoizedPaymentMethodForm
												handlePlanSelect={handlePlanSelect}
												planId={planId}
												planName={planName}
												isProcessingPayment={isProcessingPayment}
												setOpen={setOpen}
											/>
										</Elements>
									</div>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

PaymentMethodModal.propTypes = {
	handlePlanSelect: PropTypes.func,
	isProcessingPayment: PropTypes.bool,
	open: PropTypes.bool,
	planId: PropTypes.number,
	planName: PropTypes.string,
	setOpen: PropTypes.func
};

/**
 * Memoized custom `PaymentMethodModal` component
 */
const ForwardRefPaymentMethodModal = forwardRef(PaymentMethodModal);
export const MemoizedPaymentMethodModal = memo(ForwardRefPaymentMethodModal);
