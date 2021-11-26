// React
import { useMemo, useState, useEffect } from "react";

// External
import { CreditCardIcon } from "@heroicons/react/solid";
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import {
	CurrentPaymentMethodApiEndpoint,
	DefaultPaymentMethodApiEndpoint,
	PaymentMethodApiEndpoint
} from "@enums/ApiEndpoints";
import { PaymentMethodFormLabels } from "@enums/PaymentMethodFormLabels";
import { SubscriptionLabels } from "@enums/SubscriptionLabels";

// Hooks
import { usePostMethod } from "@hooks/useHttpMethod";

const useOptions = () => {
	const options = useMemo(() => ({
		style: {
			base: {
				fontFamily:
					'Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
				"::placeholder": {
					color: "#aab7c4"
				},
				color: "#424770",
				letterSpacing: "0.025em",
				lineHeight: "1.25rem"
			},
			invalid: {
				color: "#ef4444"
			}
		}
	}));

	return options;
};

const PaymentMethodForm = ({
	componentReady,
	defaultPaymentMethod,
	mutateDefaultPaymentMethod,
	mutatePaymentMethods,
	paymentMethods,
	setErrorMsg,
	setSuccessMsg
}) => {
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState([]);
	const [disableForm, setDisableForm] = useState(true);
	const [errorCardCvc, setErrorCardCvc] = useState("");
	const [errorCardExpiry, setErrorCardExpiry] = useState("");
	const [errorCardNumber, setErrorCardNumber] = useState("");
	const [loading, setLoading] = useState(false);

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();

	useEffect(() => {
		paymentMethods !== undefined &&
		paymentMethods !== null &&
		Object.keys(paymentMethods).length &&
		defaultPaymentMethod !== undefined &&
		defaultPaymentMethod !== null &&
		Object.keys(defaultPaymentMethod).length > 0
			? (() => {
					Object.values(paymentMethods)
						.filter((paymentMethod) => paymentMethod?.id === defaultPaymentMethod?.id)
						.map((val) => {
							setCurrentPaymentMethod(val);
						});
			  })()
			: setCurrentPaymentMethod([]);
	}, [paymentMethods, defaultPaymentMethod]);

	const handleAddNewCardInformation = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		setLoading(true);
		setErrorMsg([]);
		setSuccessMsg([]);
		setErrorCardNumber("");
		setErrorCardExpiry("");
		setErrorCardCvc("");

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

			const response = await usePostMethod(CurrentPaymentMethodApiEndpoint, body);

			Math.floor(response?.status / 200) === 1
				? (() => {
						mutatePaymentMethods(PaymentMethodApiEndpoint);
						mutateDefaultPaymentMethod(DefaultPaymentMethodApiEndpoint);

						setLoading(false);
						setDisableForm(true);
						setSuccessMsg((successMsg) => [...successMsg, PaymentMethodFormLabels[8].label]);
				  })()
				: (() => {
						setLoading(false);
						setDisableForm(false);
						setErrorMsg((errorMsg) => [...errorMsg, PaymentMethodFormLabels[9].label]);
				  })();
		}
	};

	return (
		<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleAddNewCardInformation}>
			{!disableForm ? (
				<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
					<div tw="sm:col-span-3">
						{componentReady && !disableForm ? (
							<>
								<label
									htmlFor="card-number"
									tw="block text-sm text-left font-medium leading-5 text-gray-700"
								>
									{PaymentMethodFormLabels[0].label}
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
									<span tw="block mt-2 text-left text-xs leading-5 text-red-700">
										{errorCardNumber}
									</span>
								)}
							</>
						) : (
							<div>
								<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
								<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
							</div>
						)}
					</div>

					<div tw="sm:col-span-3">
						{componentReady && !disableForm ? (
							<>
								<label
									htmlFor="expiration-date"
									tw="block text-sm text-left font-medium leading-5 text-gray-700"
								>
									{PaymentMethodFormLabels[1].label}
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
									<span tw="block mt-2 text-left text-xs leading-5 text-red-700">
										{errorCardExpiry}
									</span>
								)}
							</>
						) : (
							<div>
								<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
								<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
							</div>
						)}
					</div>

					<div tw="sm:col-span-3">
						{componentReady && !disableForm ? (
							<>
								<label
									htmlFor="cvc"
									tw="block text-sm text-left font-medium leading-5 text-gray-700"
								>
									{PaymentMethodFormLabels[2].label}
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
									<span tw="block mt-2 text-left text-xs leading-5 text-red-700">
										{errorCardCvc}
									</span>
								)}
							</>
						) : (
							<div>
								<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
								<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
							</div>
						)}
					</div>

					<div tw="sm:col-span-3">
						<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
							<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
								<span tw="inline-flex">
									{componentReady ? (
										<button
											type="submit"
											disabled={loading}
											css={[
												tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
												loading
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
											]}
										>
											{loading
												? PaymentMethodFormLabels[3].label
												: PaymentMethodFormLabels[5].label}
										</button>
									) : (
										<Skeleton
											duration={2}
											width={82.39}
											height={38}
											tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
										/>
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
					<div tw="sm:col-span-3">
						{componentReady && disableForm ? (
							<>
								<label
									htmlFor="cardinformation"
									tw="block text-sm text-left font-medium text-gray-700"
								>
									{SubscriptionLabels[6].label}
								</label>
								<div tw="mt-1 relative rounded-md shadow-sm">
									<div tw="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<CreditCardIcon tw="h-5 w-5 text-gray-400" />
									</div>
									<input
										type="text"
										disabled={disableForm}
										id="cardinformation"
										css={[
											tw`pl-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300`,
											disableForm && tw`opacity-50 bg-gray-300 cursor-not-allowed`
										]}
										placeholder={PaymentMethodFormLabels[16].label}
										value={
											currentPaymentMethod !== undefined &&
											currentPaymentMethod !== null &&
											typeof currentPaymentMethod == "object" &&
											Object.keys(currentPaymentMethod).length > 0
												? currentPaymentMethod?.card?.brand.charAt(0).toUpperCase() +
												  currentPaymentMethod?.card?.brand.slice(1) +
												  " - " +
												  " " +
												  "****" +
												  " " +
												  currentPaymentMethod?.card?.last4
												: ""
										}
										aria-describedby="cardinformation"
									/>
								</div>
							</>
						) : (
							<>
								<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
								<Skeleton duration={2} width={377.75} height={38} tw="mt-1 relative flex " />
							</>
						)}
					</div>

					<div tw="sm:col-span-3">
						<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
							<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
								<span tw="inline-flex">
									{componentReady ? (
										<button
											type="button"
											disabled={loading}
											css={[
												tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
												loading
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
											]}
											onClick={() => setDisableForm(!disableForm)}
										>
											{PaymentMethodFormLabels[4].label}
										</button>
									) : (
										<Skeleton
											duration={2}
											width={82.39}
											height={38}
											tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
										/>
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</form>
	);
};

PaymentMethodForm.propTypes = {
	componentReady: PropTypes.bool,
	defaultPaymentMethod: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	mutateDefaultPaymentMethod: PropTypes.func,
	mutatePaymentMethods: PropTypes.func,
	paymentMethods: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	setErrorMsg: PropTypes.func,
	setSuccessMsg: PropTypes.func
};

PaymentMethodForm.defaultProps = {
	componentReady: false,
	defaultPaymentMethod: null,
	mutateDefaultPaymentMethod: null,
	mutatePaymentMethods: null,
	paymentMethods: null,
	setErrorMsg: null,
	setSuccessMsg: null
};

export default PaymentMethodForm;
