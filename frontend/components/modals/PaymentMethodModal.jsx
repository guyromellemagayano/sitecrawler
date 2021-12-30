import SelectCardForm from "@components/forms/SelectCardForm";
import { Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useDefaultPaymentMethod } from "@hooks/useDefaultPaymentMethod";
import { useStripePromise } from "@hooks/useStripePromise";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import "twin.macro";

/**
 * Custom function to render the `PaymentMethodModal` component
 */
export function PaymentMethodModal(props, ref) {
	const [stripePromiseData, setStripePromiseData] = useState(null);

	// Props
	const { handlePlanSelect, showModal, setShowModal, planId, planName, isProcessingPayment } = props;

	// Translation
	const { t } = useTranslation();
	const subscriptionPlabsUpgradePlanLabel = t("settings:subscriptionPlans.upgradePlan.label");
	const subscriptionPlabsUpgradePlanDescription = t("settings:subscriptionPlans.upgradePlan.description");

	// SWR hooks
	const { stripePromise, errorStripePromise, validatingStripePromise } = useStripePromise();
	const { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod } = useDefaultPaymentMethod();

	// Handle `stripe` promise
	const handleStripePromise = useCallback(async () => {
		if (!validatingStripePromise) {
			if (!errorStripePromise && typeof stripePromise !== "undefined" && stripePromise !== null) {
				const stripePromisePublishableKey = await stripePromise?.data?.publishable_key;

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
		<Transition show={showModal} as="span">
			<div tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="payment-method-modal-first-child-enter"
					enterFrom="payment-method-modal-first-child-enter-from"
					enterTo="payment-method-modal-first-child-enter-to"
					leave="payment-method-modal-first-child-leave"
					leaveFrom="payment-method-modal-first-child-leave-from"
					leaveTo="payment-method-modal-first-child-leave-to"
				>
					<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>

				<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

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
						tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div tw="sm:flex sm:items-start">
							<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-green-100">
								<CreditCardIcon tw="h-6 w-6 text-green-600" />
							</div>
							<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 tw="text-lg leading-6 font-medium text-gray-900">{subscriptionPlabsUpgradePlanLabel}</h3>
								<p tw="my-2 text-sm leading-5 text-gray-500">{subscriptionPlabsUpgradePlanDescription}</p>

								<div tw="w-full text-center mt-5 sm:rounded-lg inline-block">
									<Elements stripe={stripePromiseData}>
										{!validatingDefaultPaymentMethod ? (
											!errorDefaultPaymentMethod &&
											typeof defaultPaymentMethod !== "undefined" &&
											defaultPaymentMethod !== null &&
											!defaultPaymentMethod?.data?.detail ? (
												<SelectCardForm
													handlePlanSelect={handlePlanSelect}
													planId={planId}
													planName={planName}
													isProcessingPayment={isProcessingPayment}
													setShowModal={setShowModal}
													defaultPaymentMethod={defaultPaymentMethod}
												/>
											) : null
										) : null}
									</Elements>
								</div>
							</div>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
}

/**
 * Memoized custom `PaymentMethodModal` component
 */
export const ForwardRefPaymentMethodModal = forwardRef(PaymentMethodModal);
export const MemoizedPaymentMethodModal = memo(ForwardRefPaymentMethodModal);
