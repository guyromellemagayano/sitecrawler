// React
import { useState, useMemo, useEffect } from "react";

// External
import { CreditCardIcon } from "@heroicons/react/solid";
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import PaymentMethodFormLabel from "public/labels/components/form/PaymentMethodForm.json";
import SubscriptionLabel from "public/labels/pages/settings/subscriptions.json";

// Hooks
import { usePaymentMethods, useDefaultPaymentMethod } from "src/hooks/useStripePromise";
import usePostMethod from "src/hooks/usePostMethod";

const useOptions = () => {
	const options = useMemo(() => ({
		style: {
			base: {
				"fontFamily":
					'Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
				"::placeholder": {
					color: "#aab7c4"
				},
				"color": "#424770",
				"letterSpacing": "0.025em",
				"lineHeight": "1.25rem"
			},
			invalid: {
				color: "#ef4444"
			}
		}
	}));

	return options;
};

const PaymentMethodForm = ({
	loading,
	setLoading,
	setSuccessMsg,
	setSuccessMsgLoaded,
	showPaymentFormModal,
	setShowPaymentFormModal,
	updatedPlanId,
	updatedPlanName,
	handleSelectPlan
}) => {
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState([]);
	const [currentPaymentMethods, setCurrentPaymentMethods] = useState([]);
	const [disableForm, setDisableForm] = useState(true);
	const [errorCardCvc, setErrorCardCvc] = useState("");
	const [errorCardExpiry, setErrorCardExpiry] = useState("");
	const [errorCardNumber, setErrorCardNumber] = useState("");
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);

	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();

	const { paymentMethods: paymentMethods, paymentMethodsError: paymentMethodsError } = usePaymentMethods({});
	const { defaultPaymentMethod: defaultPaymentMethod, defaultPaymentMethodError: defaultPaymentMethodError } =
		useDefaultPaymentMethod({});

	useEffect(() => {
		if (
			paymentMethods &&
			paymentMethods !== undefined &&
			Object.keys(paymentMethods).length > 0 &&
			defaultPaymentMethod &&
			defaultPaymentMethod !== undefined &&
			Object.keys(defaultPaymentMethod).length > 0
		) {
			paymentMethods
				.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod.id)
				.map((val) => {
					setCurrentPaymentMethod(val);
				});

			let currentPaymentMethodsArray = [];
			paymentMethods.map((val) => {
				currentPaymentMethodsArray.push([val.id, val.card]);
			});

			setCurrentPaymentMethods(currentPaymentMethodsArray);
		}
	}, [paymentMethods, defaultPaymentMethod]);

	useEffect(() => {
		setSelectedPaymentMethod(currentPaymentMethod.id);
	}, [currentPaymentMethod]);

	const handleAddNewCardInformation = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		const payload = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardNumberElement)
		});

		if (payload.error) {
			if (payload.error.code === "incomplete_number") {
				setErrorCardNumber(payload.error.message);
			}

			if (payload.error.code === "incomplete_expiry") {
				setErrorCardExpiry(payload.error.message);
			}

			if (payload.error.code === "incomplete_cvc") {
				setErrorCardCvc(payload.error.message);
			}

			setLoading(false);
			setDisableForm(false);
		} else {
			try {
				const body = {
					id: payload.paymentMethod.id
				};

				setLoading(true);
				setDisableForm(false);

				const response = await usePostMethod(paymentMethodApiEndpoint, body);
				const data = await response.data;

				if (Math.floor(response.status / 200) === 1) {
					if (data) {
						setLoading(false);
						setSuccessMsg(PaymentMethodFormLabel[8].label);
						setSuccessMsgLoaded(true);
						setDisableForm(true);
					}
				} else {
					if (data) {
						console.log(data);
					}
				}
			} catch (error) {
				throw error.message;
			}
		}
	};

	return (
		<>
			{!disableForm ? (
				<form tw="space-y-8" onSubmit={handleAddNewCardInformation}>
					<div tw="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
						<div tw="sm:col-span-6">
							<label htmlFor="card-number" tw="block text-sm text-left font-medium leading-5 text-gray-700">
								{PaymentMethodFormLabel[0].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardNumber ? tw`border-red-300` : tw`border-gray-300`
									]}
								>
									<CardNumberElement options={options} />
								</span>
							</div>
							{!loading && errorCardNumber && (
								<span tw="block mt-2 text-left text-xs leading-5 text-red-700">{errorCardNumber}</span>
							)}
						</div>
						<div tw="sm:col-span-6">
							<label htmlFor="expiration-date" tw="block text-sm text-left font-medium leading-5 text-gray-700">
								{PaymentMethodFormLabel[1].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardExpiry ? tw`border-red-300` : tw`border-gray-300`
									]}
								>
									<CardExpiryElement options={options} />
								</span>
							</div>
							{!loading && errorCardExpiry && (
								<span tw="block mt-2 text-left text-xs leading-5 text-red-700">{errorCardExpiry}</span>
							)}
						</div>
						<div tw="sm:col-span-6">
							<label htmlFor="cvc" tw="block text-sm text-left font-medium leading-5 text-gray-700">
								{PaymentMethodFormLabel[2].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardCvc ? tw`border-red-300` : tw`border-gray-300`
									]}
								>
									<CardCvcElement options={options} />
								</span>
							</div>
							{!loading && errorCardCvc && (
								<span tw="block mt-2 text-left text-xs leading-5 text-red-700">{errorCardCvc}</span>
							)}
						</div>
						<div tw="sm:col-span-6">
							<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto lg:order-1 lg:w-full">
									<span tw="relative z-20 w-full inline-flex">
										<button
											type="submit"
											disabled={loading}
											css={[
												tw`cursor-pointer flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
												loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-green-700`
											]}
										>
											{loading ? PaymentMethodFormLabel[3].label : PaymentMethodFormLabel[5].label}
										</button>
										<button
											type="button"
											css={[
												tw`flex-grow flex-1 mt-3 mr-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
												loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-gray-50`
											]}
											onClick={() => setDisableForm(true)}
										>
											{PaymentMethodFormLabel[12].label}
										</button>
										<button
											type="button"
											css={[
												tw`flex-grow flex-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
												loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-gray-50`
											]}
											onClick={() => setShowPaymentFormModal(!showPaymentFormModal)}
										>
											{PaymentMethodFormLabel[11].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			) : (
				<form tw="space-y-8">
					<div tw="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-6">
							<div tw="space-y-1">
								<label htmlFor="email" tw="block text-sm text-left font-medium text-gray-700">
									{SubscriptionLabel[6].label}
								</label>
								<div tw="mt-1 relative rounded-md shadow-sm">
									<div tw="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<CreditCardIcon tw="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										disabled={disableForm}
										tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
										id="cardinformation"
										tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
										placeholder={PaymentMethodFormLabel[16].label}
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
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto lg:order-1 lg:w-full">
									<span tw="relative z-10 w-full inline-flex">
										<button
											type="button"
											css={[
												tw`flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
												loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-green-700`
											]}
											onClick={() => handleSelectPlan(updatedPlanId, updatedPlanName, selectedPaymentMethod)}
										>
											{loading ? PaymentMethodFormLabel[15].label : PaymentMethodFormLabel[13].label}
										</button>
										<button
											type="button"
											css={[
												tw`flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
												!disableForm || loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-indigo-700`
											]}
											onClick={() => setDisableForm(!disableForm)}
										>
											{PaymentMethodFormLabel[10].label}
										</button>
										<button
											type="button"
											css={[
												tw`flex-shrink-0 flex-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
												!disableForm || loading ? tw`opacity-50 cursor-not-allowed` : tw`hover:bg-gray-50`
											]}
											onClick={() => setShowPaymentFormModal(!showPaymentFormModal)}
										>
											{PaymentMethodFormLabel[11].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</>
	);
};

PaymentMethodForm.propTypes = {};

export default PaymentMethodForm;
