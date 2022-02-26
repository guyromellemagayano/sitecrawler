import { MemoizedPaymentMethodForm } from "@components/forms/PaymentMethodForm";
import { Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useStripePromise } from "@hooks/useStripePromise";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";

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
	const [stripePromiseData, setStripePromiseData] = useState(null);

	// Translation
	const { t } = useTranslation();
	const subscriptionPlansUpgradePlanLabel = t("settings:subscriptionPlans.upgradePlan.label");
	const subscriptionPlansUpgradePlanDescription = t("settings:subscriptionPlans.upgradePlan.description");

	// SWR hooks
	const { stripePromise, errorStripePromise, validatingStripePromise } = useStripePromise();

	// Handle `stripe` promise
	const handleStripePromise = useCallback(async () => {
		if (!validatingStripePromise) {
			if (!errorStripePromise && typeof stripePromise !== "undefined" && stripePromise !== null) {
				const stripePromisePublishableKey =
					stripePromise?.data?.length > 0 ? await stripePromise?.data?.publishable_key : null;

				if (stripePromisePublishableKey !== null) {
					setStripePromiseData(loadStripe(stripePromisePublishableKey, { stripePromise }));
				} else {
					setStripePromiseData(null);
				}
			}
		}
	}, [stripePromise, validatingStripePromise, errorStripePromise]);

	useEffect(() => {
		handleStripePromise();
	}, [handleStripePromise]);

	return (
		<Transition show={open} className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"></div>
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

			<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
				&#8203;
			</span>

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
					className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div className="sm:flex sm:items-start">
						<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
							<CreditCardIcon className="h-6 w-6 text-green-600" />
						</div>

						<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 className="text-lg font-medium leading-6 text-gray-900">{subscriptionPlansUpgradePlanLabel}</h3>
							<div className="mt-2">
								<p className="text-sm text-gray-500">{subscriptionPlansUpgradePlanDescription}</p>
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
		</Transition>
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
