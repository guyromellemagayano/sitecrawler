// React
import * as React from "react";

// External
import "twin.macro";
import { CreditCardIcon } from "@heroicons/react/solid";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Transition } from "@headlessui/react";

// JSON
import PaymentMethodFormModalLabel from "./labels/PaymentMethodFormModal.json";

// Components
import PaymentMethodForm from "src/components/forms/PaymentMethodForm";

const PaymentMethodFormModal = (props) => {
	const [stripePromiseData, setStripePromiseData] = React.useState("");

	const handleHideSiteDeleteModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", handleHideSiteDeleteModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteDeleteModal, true);
		};
	});

	React.useEffect(() => {
		props.stripePublishableKey ? setStripePromiseData(loadStripe(props.stripePublishableKey)) : null;
	}, [props.stripePublishableKey]);

	return (
		<Transition
			show={props.showModal}
			tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				enterTo="opacity-100 translate-y-0 sm:scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 translate-y-0 sm:scale-100"
				leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			>
				<div
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
							<h3 tw="text-lg leading-6 font-medium text-gray-900">{PaymentMethodFormModalLabel[0].label}</h3>
							<p tw="my-2 text-sm leading-5 text-gray-500">{PaymentMethodFormModalLabel[0].description}</p>

							<div tw="w-full text-center mt-5 sm:rounded-lg inline-block">
								<Elements stripe={stripePromiseData}>
									<PaymentMethodForm
										loading={props.loading}
										setLoading={props.setLoading}
										successMsgLoaded={props.successMsgLoaded}
										setSuccessMsgLoaded={props.setSuccessMsgLoaded}
										showPaymentFormModal={props.showModal}
										setShowPaymentFormModal={props.setShowModal}
										updatedPlanId={props.updatedPlanId}
										updatedPlanName={props.updatedPlanName}
										handleSelectPlan={props.handleSelectPlan}
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

PaymentMethodFormModal.propTypes = {};

export default PaymentMethodFormModal;
