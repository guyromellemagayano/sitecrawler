// React
import * as React from "react";

// External
import "twin.macro";
import { CreditCardIcon } from "@heroicons/react/solid";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Transition } from "@headlessui/react";
import PropTypes from "prop-types";

// Enums
import { PaymentMethodModalLabels } from "@enums/PaymentMethodModalLabels";

// Components
import SelectCardForm from "@components/forms/SelectCardForm";

const PaymentMethodModal = React.forwardRef(
	(
		{
			handleSelectPlan,
			loading,
			mutateUser,
			setLoading,
			setShowModal,
			showModal,
			stripePublishableKey,
			updatedPlanId,
			updatedPlanName,
			userApiEndpoint
		},
		ref
	) => {
		const [stripePromiseData, setStripePromiseData] = React.useState("");

		React.useEffect(() => {
			stripePublishableKey ? setStripePromiseData(loadStripe(stripePublishableKey)) : null;
		}, [stripePublishableKey]);

		return (
			<Transition show={showModal} as="span">
				<div tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
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
									<h3 tw="text-lg leading-6 font-medium text-gray-900">
										{PaymentMethodModalLabels[0].label}
									</h3>
									<p tw="my-2 text-sm leading-5 text-gray-500">
										{PaymentMethodModalLabels[0].description}
									</p>

									<div tw="w-full text-center mt-5 sm:rounded-lg inline-block">
										<Elements stripe={stripePromiseData}>
											<SelectCardForm
												handleSelectPlan={handleSelectPlan}
												loading={loading}
												mutateUser={mutateUser}
												setLoading={setLoading}
												setShowModal={setShowModal}
												showModal={showModal}
												updatedPlanId={updatedPlanId}
												updatedPlanName={updatedPlanName}
												userApiEndpoint={userApiEndpoint}
											/>
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
);

PaymentMethodModal.propTypes = {
	handleSelectPlan: PropTypes.func,
	loading: PropTypes.bool,
	mutateUser: PropTypes.func,
	setLoading: PropTypes.func,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool,
	stripePublishableKey: PropTypes.string,
	updatedPlanId: PropTypes.number,
	updatedPlanName: PropTypes.string,
	userApiEndpoint: PropTypes.string
};

PaymentMethodModal.defaultProps = {
	handleSelectPlan: null,
	loading: false,
	mutateUser: null,
	setLoading: null,
	setShowModal: null,
	showModal: false,
	stripePublishableKey: null,
	updatedPlanId: null,
	updatedPlanName: null,
	userApiEndpoint: null
};

export default PaymentMethodModal;
