import { MemoizedPaymentMethodForm } from "@components/forms/PaymentMethodForm";
import { Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useStripePromise } from "@hooks/useStripePromise";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import "twin.macro";

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
		<Transition show={open} tw="fixed z-50 inset-0 overflow-y-auto">
			<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"></div>
			<Transition.Child
				enter="payment-method-modal-first-child-enter"
				enterFrom="payment-method-modal-first-child-enter-from"
				enterTo="payment-method-modal-first-child-enter-to"
				leave="payment-method-modal-first-child-leave"
				leaveFrom="payment-method-modal-first-child-leave-from"
				leaveTo="payment-method-modal-first-child-leave-to"
			>
				<div tw="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
				&#8203;
			</span>

			<Transition.Child
				enter="payment-method-modal-second-child-enter"
				enterFrom="payment-method-modal-second-child-enter-from"
				enterTo="payment-method-modal-second-child-enter-to"
				leave="payment-method-modal-second-child-leave"
				leaveFrom="payment-method-modal-second-child-leave-from"
				leaveTo="payment-method-modal-second-child-leave-to"
			>
				<div
					ref={ref}
					tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div tw="sm:flex sm:items-start">
						<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
							<CreditCardIcon tw="h-6 w-6 text-green-600" />
						</div>

						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900">{subscriptionPlansUpgradePlanLabel}</h3>
							<div tw="mt-2">
								<p tw="text-sm text-gray-500">{subscriptionPlansUpgradePlanDescription}</p>
							</div>

							<div tw="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex">
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
