// React
import * as React from "react";

// External
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from "@stripe/react-stripe-js";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import PaymentMethodFormLabel from "./labels/PaymentMethodForm.json";

const PaymentMethodForm = (props) => {
	const [componentReady, setComponentReady] = React.useState([]);
	const [currentPaymentMethod, setCurrentPaymentMethod] = React.useState([]);
	const [disableForm, setDisableForm] = React.useState(true);
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();

	React.useEffect(() => {
		props.paymentMethods && props.defaultPaymentMethod
			? (() => {
					props.paymentMethods
						.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod.id)
						.map((val) => {
							setCurrentPaymentMethod(val);
						});

					setComponentReady(true);
			  })()
			: setComponentReady(false);

		return { currentPaymentMethod };
	}, [props.paymentMethods, props.defaultPaymentMethod]);

	React.useEffect(() => {
		currentPaymentMethod ? setSelectedPaymentMethod(currentPaymentMethod.id) : null;
	}, [currentPaymentMethod]);

	const handleUpdateCardInformation = async (e) => {
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
			.then((response) => {})
			.catch((error) => {
				Sentry.captureException(error);

				setLoading(false);
				setDisableForm(false);
			});
	};

	return (
		<>
			{!disableForm ? (
				<form tw="space-y-8" onSubmit={handleUpdateCardInformation}>
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
													<h3
														key={index}
														tw="text-sm leading-5 font-medium text-red-800 break-words"
														id="modal-headline"
													>
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
				</form>
			) : (
				<div tw="sm:col-span-3">
					{componentReady ? (
						<>
							<label htmlFor="card-information" tw="block text-sm font-medium leading-5 text-gray-700">
								{CardLabel[2].label}
							</label>
							<div tw="mt-1 relative rounded-md shadow-sm">
								<input
									id="card-information"
									type="text"
									name="card_information"
									value={
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
									disabled={true}
									tw="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 opacity-50 bg-gray-300 cursor-not-allowed"
									placeholder={CardLabel[1].label}
									aria-describedby="cardInformation"
									onChange={handleCardInformationInputChange}
								/>
							</div>
						</>
					) : (
						<>
							<Skeleton duration={2} width={150} height={20} tw="block text-sm" />
							<Skeleton duration={2} width={435.17} height={38} tw="mt-1 relative flex " />
						</>
					)}
				</div>
			)}

			<div tw="sm:col-span-3">
				<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
					<div tw="sm:w-auto sm:mr-1 lg:w-full">
						{componentReady ? (
							!disableForm ? (
								<span tw="inline-flex justify-start">
									<button
										type="submit"
										disabled={isSubmitting || Object.keys(errors).length > 0}
										css={[
											tw`flex-initial w-full whitespace-nowrap mt-3 mr-3 sm:mt-0 relative px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
											isSubmitting || Object.keys(errors).length > 0
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
										]}
									>
										{isSubmitting ? CardLabel[3].label : !disableForm ? CardLabel[4].label : CardLabel[6].label}
									</button>

									<button
										type="button"
										disabled={isSubmitting || Object.keys(errors).length > 0}
										css={[
											tw`flex-initial w-full whitespace-nowrap mt-3 mr-3 sm:mt-0 relative px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium rounded-md text-gray-700`,
											isSubmitting || Object.keys(errors).length > 0
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
										onClick={() => setDisableForm(!disableForm)}
									>
										{CardLabel[5].label}
									</button>
								</span>
							) : (
								<span tw="inline-flex justify-start">
									<button
										type="button"
										disabled={isSubmitting || Object.keys(errors).length > 0}
										css={[
											tw`flex-initial w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
											isSubmitting || Object.keys(errors).length > 0
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
										onClick={() => setDisableForm(!disableForm)}
									>
										{isSubmitting ? CardLabel[3].label : CardLabel[6].label}
									</button>
								</span>
							)
						) : (
							<Skeleton
								duration={2}
								width={82.39}
								height={38}
								tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

PaymentMethodForm.propTypes = {};

export default PaymentMethodForm;
