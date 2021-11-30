// React
import { useState, useEffect } from "react";

// External
import { CreditCardIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Enums
import { PaymentMethodFormLabels } from "@enums/PaymentMethodFormLabels";
import { SubscriptionLabels } from "@enums/SubscriptionLabels";

// Hooks
import { usePaymentMethods, useDefaultPaymentMethod } from "@hooks/useStripePromise";

const SelectCardForm = ({
	handleSelectPlan,
	loading,
	setShowModal,
	showModal,
	updatedPlanId,
	updatedPlanName
}) => {
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState([]);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);

	const { paymentMethods } = usePaymentMethods({});
	const { defaultPaymentMethod } = useDefaultPaymentMethod({});

	useEffect(() => {
		paymentMethods && defaultPaymentMethod
			? (() => {
					paymentMethods
						.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod.id)
						.map((val) => {
							setCurrentPaymentMethod(val);
						});
			  })()
			: null;
	}, [paymentMethods, defaultPaymentMethod]);

	useEffect(() => {
		currentPaymentMethod ? setSelectedPaymentMethod(currentPaymentMethod.id) : null;
	}, [currentPaymentMethod]);

	return (
		<form tw="space-y-8">
			<div tw="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
				<div tw="sm:col-span-6">
					<div tw="space-y-1">
						<label htmlFor="email" tw="block text-sm text-left font-medium text-gray-700">
							{SubscriptionLabels[6].label}
						</label>
						<div tw="mt-1 relative rounded-md shadow-sm">
							<div tw="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<CreditCardIcon tw="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								id="cardinformation"
								tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
								placeholder={PaymentMethodFormLabels[16].label}
								readOnly
								value={
									currentPaymentMethod &&
									currentPaymentMethod !== undefined &&
									Object.keys(currentPaymentMethod).length > 0
										? currentPaymentMethod.card.brand.charAt(0).toUpperCase() +
										  currentPaymentMethod.card.brand.slice(1) +
										  " - " +
										  " " +
										  "****" +
										  " " +
										  currentPaymentMethod.card.last4
										: ""
								}
								aria-describedby="cardinformation"
							/>
						</div>
					</div>
				</div>
				<div tw="sm:col-span-6">
					<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
						<div tw="flex justify-start order-1 sm:flex-row sm:w-auto lg:order-1">
							<span tw="relative z-10 w-full inline-flex">
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-grow w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 `,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
									]}
									onClick={() =>
										handleSelectPlan(updatedPlanId, updatedPlanName, selectedPaymentMethod)
									}
								>
									{loading ? PaymentMethodFormLabels[15].label : PaymentMethodFormLabels[13].label}
								</button>
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-shrink-0 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm`,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									onClick={() => setShowModal(!showModal)}
								>
									{PaymentMethodFormLabels[11].label}
								</button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

SelectCardForm.propTypes = {
	handleSelectPlan: PropTypes.func,
	loading: PropTypes.bool,
	setShowModal: PropTypes.func,
	showModal: PropTypes.bool,
	updatedPlanId: PropTypes.number,
	updatedPlanName: PropTypes.string
};

SelectCardForm.defaultProps = {
	handleSelectPlan: null,
	loading: false,
	setShowModal: null,
	showModal: false,
	updatedPlanId: null,
	updatedPlanName: null
};

export default SelectCardForm;
