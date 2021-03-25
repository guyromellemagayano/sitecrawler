// React
import { useState, useMemo, useEffect } from "react";

// NextJS
import Router from "next/router";

// External
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import PaymentMethodFormLabel from "public/labels/components/form/PaymentMethodForm.json";
import SubscriptionLabel from "public/labels/pages/subscriptions.json";

// Hooks
import { usePaymentMethod, useDefaultPaymentMethod } from "src/hooks/useStripePromise";
import usePostMethod from "src/hooks/usePostMethod";

// Components
const ErrorNotificationModal = loadable(() => import("src/components/modals/ErrorNotificationModal"));
const SuccessNotificationModal = loadable(() => import("src/components/modals/SuccessNotificationModal"));

const useOptions = () => {
	const options = useMemo(() => ({
		style: {
			base: {
				fontFamily:
					'Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
				"::placeholder": {
					color: "#aab7c4",
				},
				color: "#424770",
				letterSpacing: "0.025em",
				lineHeight: "1.25rem",
			},
			invalid: {
				color: "#ef4444",
			},
		},
	}));

	return options;
};

const PaymentMethodForm = (props) => {
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState([]);
	const [disableForm, setDisableForm] = useState(true);
	const [errorCardCvc, setErrorCardCvc] = useState("");
	const [errorCardExpiry, setErrorCardExpiry] = useState("");
	const [errorCardNumber, setErrorCardNumber] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();

	const { paymentMethod: paymentMethod, paymentMethodError: paymentMethodError } = usePaymentMethod({
		refreshInterval: 1000,
	});
	const {
		defaultPaymentMethod: defaultPaymentMethod,
		defaultPaymentMethodError: defaultPaymentMethodError,
	} = useDefaultPaymentMethod({
		refreshInterval: 1000,
	});

	useEffect(() => {
		if (
			paymentMethod &&
			paymentMethod !== undefined &&
			Object.keys(paymentMethod).length > 0 &&
			defaultPaymentMethod &&
			defaultPaymentMethod !== undefined &&
			Object.keys(defaultPaymentMethod).length > 0
		) {
			paymentMethod
				.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod.id)
				.map((val) => {
					setCurrentPaymentMethod(val);
				});

			setPaymentMethods(paymentMethod);
		}
	}, [paymentMethod, defaultPaymentMethod]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		const payload = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardNumberElement),
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
					id: payload.paymentMethod.id,
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

						Router.push("/settings/profile");
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
			<SuccessNotificationModal
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={PaymentMethodFormLabel[6].label}
			/>
			<ErrorNotificationModal
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={PaymentMethodFormLabel[7].label}
			/>
			{!disableForm ? (
				<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-4">
							<label htmlFor="card-number" className={`block text-sm font-medium leading-5 text-gray-700`}>
								{PaymentMethodFormLabel[0].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardNumber ? tw`border-red-300` : tw`border-gray-300`,
									]}
								>
									<CardNumberElement options={options} />
								</span>
							</div>
							{!loading && errorCardNumber && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardNumber}</span>
							)}
						</div>
						<div tw="sm:col-span-4">
							<label htmlFor="expiration-date" className={`block text-sm font-medium leading-5 text-gray-700`}>
								{PaymentMethodFormLabel[1].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardExpiry ? tw`border-red-300` : tw`border-gray-300`,
									]}
								>
									<CardExpiryElement options={options} />
								</span>
							</div>
							{!loading && errorCardExpiry && (
								<span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardExpiry}</span>
							)}
						</div>
						<div tw="sm:col-span-4">
							<label htmlFor="cvc" className={`block text-sm font-medium leading-5 text-gray-700`}>
								{PaymentMethodFormLabel[2].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<span
									css={[
										tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
										loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
										!loading && errorCardCvc ? tw`border-red-300` : tw`border-gray-300`,
									]}
								>
									<CardCvcElement options={options} />
								</span>
							</div>
							{!loading && errorCardCvc && <span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardCvc}</span>}
						</div>
						<div tw="sm:col-span-4">
							<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
									<span tw="inline-flex">
										<button
											type="submit"
											disabled={loading}
											css={[
												tw`w-full mt-3 mr-3 ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
												loading
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
											]}
										>
											{loading ? PaymentMethodFormLabel[3].label : PaymentMethodFormLabel[5].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			) : (
				<div tw="space-y-8 divide-y divide-gray-200">
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<div tw="sm:col-span-4">
							<label htmlFor="cardinformation" tw="block text-sm font-medium leading-5 text-gray-700">
								{SubscriptionLabel[6].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<input
									type="text"
									id="cardinformation"
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
									name="cardinformation"
									disabled={disableForm}
									css={[
										tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300`,
										disableForm && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
									]}
									aria-describedby="cardinformation"
								/>
							</div>
						</div>
						<div tw="sm:col-span-4">
							<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
								<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
									<span tw="inline-flex">
										<button
											type="button"
											css={[
												tw`w-full mt-3 mr-3 ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
												!disableForm
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
											]}
											onClick={() => setDisableForm(!disableForm)}
										>
											{PaymentMethodFormLabel[4].label}
										</button>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

PaymentMethodForm.propTypes = {};

export default PaymentMethodForm;
