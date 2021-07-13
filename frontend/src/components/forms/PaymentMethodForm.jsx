// React
import * as React from "react";

// External
import { CreditCardIcon } from "@heroicons/react/solid";
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import PaymentMethodFormLabel from "public/labels/components/form/PaymentMethodForm.json";
import SubscriptionLabel from "public/labels/pages/settings/subscriptions.json";

// Hooks
import { usePaymentMethods, useDefaultPaymentMethod } from "src/hooks/useStripePromise";
import usePostMethod from "src/hooks/usePostMethod";

const useOptions = () => {
	const options = React.useMemo(() => ({
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
	showPaymentFormModal,
	setShowPaymentFormModal,
	updatedPlanId,
	updatedPlanName,
	handleSelectPlan
}) => {
	const [currentPaymentMethod, setCurrentPaymentMethod] = React.useState([]);
	const [disableForm, setDisableForm] = React.useState(true);
	const [errorCardCvc, setErrorCardCvc] = React.useState("");
	const [errorCardExpiry, setErrorCardExpiry] = React.useState("");
	const [errorCardNumber, setErrorCardNumber] = React.useState("");
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const stripe = useStripe();
	const elements = useElements();

	const { paymentMethods } = usePaymentMethods({});
	const { defaultPaymentMethod } = useDefaultPaymentMethod({});

	React.useEffect(() => {
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

	React.useEffect(() => {
		currentPaymentMethod ? setSelectedPaymentMethod(currentPaymentMethod.id) : null;
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
			payload.error.code === "incomplete_number"
				? setErrorCardNumber(payload.error.message)
				: payload.error.code === "incomplete_expiry"
				? setErrorCardExpiry(payload.error.message)
				: payload.error.code === "incomplete_cvc"
				? setErrorCardCvc(payload.error.message)
				: null;

			setLoading(false);
			setDisableForm(false);
		} else {
			const body = {
				id: payload.paymentMethod.id
			};

			setLoading(true);
			setDisableForm(false);

			return await axios
				.post(paymentMethodApiEndpoint, body, {
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"X-CSRFToken": Cookies.get("csrftoken")
					}
				})
				.then((response) => {
					Math.floor(response?.status / 200) === 1
						? response?.data
							? (() => {
									setLoading(false);
									setDisableForm(false);
									setSuccessMsg((successMsg) => [...successMsg, PaymentMethodFormLabel[8].label]);
							  })()
							: (() => {
									Sentry.captureException(response);

									setLoading(false);
									setDisableForm(false);
									setErrorMsg((errorMsg) => [...errorMsg, PaymentMethodFormLabel[9].label]);
							  })()
						: (() => {
								Sentry.captureException(response);

								setLoading(false);
								setDisableForm(false);
								setErrorMsg((errorMsg) => [...errorMsg, PaymentMethodFormLabel[9].label]);
						  })();
				})
				.catch((error) => {
					Sentry.captureException(error);

					setLoading(false);
					setDisableForm(false);
					setErrorMsg((errorMsg) => [...errorMsg, PaymentMethodFormLabel[9].label]);
				});
		}
	};

	return !disableForm ? (
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
							<CardNumberElement />
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
							<CardExpiryElement />
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
							<CardCvcElement />
						</span>
					</div>
					{!loading && errorCardCvc && (
						<span tw="block mt-2 text-left text-xs leading-5 text-red-700">{errorCardCvc}</span>
					)}
				</div>

				{Object.keys(errorMsg).length > 0 || Object.keys(successMsg).length > 0 ? (
					<div tw="sm:col-span-6">
						{Object.keys(errorMsg).length > 0 ? (
							<div tw="block my-2">
								<div tw="flex justify-center sm:justify-start">
									<div>
										{errorMsg?.map((value, index) => {
											return (
												<h3 key={index} tw="text-sm leading-5 font-medium text-red-800 break-words" id="modal-headline">
													{value}
												</h3>
											);
										})}
									</div>
								</div>
							</div>
						) : Object.keys(successMsg).length > 0 ? (
							<div tw="block my-2">
								<div tw="flex justify-center sm:justify-start">
									<div>
										{successMsg?.map((value, index) => {
											return (
												<h3
													key={index}
													tw="text-sm leading-5 font-medium text-green-800 break-words"
													id="modal-headline"
												>
													{value}
												</h3>
											);
										})}
									</div>
								</div>
							</div>
						) : null}
					</div>
				) : null}

				<div tw="sm:col-span-6">
					<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
						<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto lg:order-1 lg:w-full">
							<span tw="relative z-20 w-full inline-flex">
								<button
									type="submit"
									disabled={loading}
									css={[
										tw`cursor-pointer flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
									]}
								>
									{loading ? PaymentMethodFormLabel[3].label : PaymentMethodFormLabel[5].label}
								</button>
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-grow flex-1 mt-3 mr-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm `,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									onClick={() =>
										(() => {
											setErrorMsg([]);
											setSuccessMsg([]);
											setDisableForm(true);
										})()
									}
								>
									{PaymentMethodFormLabel[12].label}
								</button>
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-grow flex-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm `,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									onClick={() =>
										(() => {
											setErrorMsg([]);
											setSuccessMsg([]);
											setShowPaymentFormModal(!showPaymentFormModal);
										})()
									}
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
									disabled={loading}
									css={[
										tw`flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 `,
										loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
									]}
									onClick={() => handleSelectPlan(updatedPlanId, updatedPlanName, selectedPaymentMethod)}
								>
									{loading ? PaymentMethodFormLabel[15].label : PaymentMethodFormLabel[13].label}
								</button>
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-grow flex-1 w-full justify-center mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
										!disableForm || loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
									]}
									onClick={() => setDisableForm(!disableForm)}
								>
									{PaymentMethodFormLabel[10].label}
								</button>
								<button
									type="button"
									disabled={loading}
									css={[
										tw`flex-shrink-0 flex-1 mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-base font-medium text-gray-700 sm:mt-0 sm:w-auto sm:text-sm`,
										!disableForm || loading
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
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
	);
};

PaymentMethodForm.propTypes = {};

export default PaymentMethodForm;
