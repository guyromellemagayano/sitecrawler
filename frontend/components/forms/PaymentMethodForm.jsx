import { MemoizedAlert } from "@components/alerts";
import { DefaultPaymentMethodApiEndpoint, PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { BillingSlug, SubscriptionPlansSlug } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useDefaultPaymentMethod } from "@hooks/useDefaultPaymentMethod";
import { useLoading } from "@hooks/useLoading";
import { usePaymentMethods } from "@hooks/usePaymentMethods";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

/**
 * Custom function to render the `PaymentMethodForm` component
 *
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} isProcessingPayment
 * @param {function} setOpen
 */
const PaymentMethodForm = ({
	handlePlanSelect,
	planId = null,
	planName = null,
	isProcessingPayment = false,
	setOpen
}) => {
	const [enablePaymentOptions, setEnablePaymentOptions] = useState(false);
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
	const [disableForm, setDisableForm] = useState(true);
	const [errorCardCvc, setErrorCardCvc] = useState(null);
	const [errorCardExpiry, setErrorCardExpiry] = useState(null);
	const [errorCardNumber, setErrorCardNumber] = useState(null);
	const [loading, setLoading] = useState(false);

	// Router
	const { asPath } = useRouter();

	// Translations
	const { t } = useTranslation();
	const update = t("common:update");
	const saving = t("settings:saving");
	const saveChanges = t("settings:saveChanges");
	const loadingCardInformation = t("settings:cardInformationSettings.loadingCardInformation");
	const cardNumber = t("settings:cardInformationSettings.cardNumber");
	const expirationDate = t("settings:cardInformationSettings.expirationDate");
	const cvc = t("settings:cardInformationSettings.cvc");
	const noCurrentCardRegistered = t("settings:cardInformationSettings.noCurrentCardRegistered");
	const addCard = t("settings:cardInformationSettings.addCard");
	const proceed = t("common:proceed");
	const close = t("common:close");
	const subscriptionPlansDefaultCard = t("settings:subscriptionPlans.defaultCard");
	const subscriptionPlansProcessingPayment = t("settings:subscriptionPlans.processingPayment");

	// SWR hooks
	const { paymentMethods, errorPaymentMethods, validatingPaymentMethods } = usePaymentMethods();
	const { defaultPaymentMethod, errorDefaultPaymentMethod, validatingDefaultPaymentMethod } = useDefaultPaymentMethod();

	// Custom hooks
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Stripe
	const stripe = useStripe();
	const elements = useElements();

	console.log(paymentMethods, defaultPaymentMethod);

	// Handle `currentPaymentMethod` state
	const handleCurrentPaymentMethod = useCallback(async () => {
		if (!validatingPaymentMethods && !validatingDefaultPaymentMethod) {
			if (
				!errorPaymentMethods &&
				typeof paymentMethods !== "undefined" &&
				paymentMethods !== null &&
				!errorDefaultPaymentMethod &&
				typeof defaultPaymentMethod !== "undefined" &&
				defaultPaymentMethod !== null
			) {
				paymentMethods?.data
					?.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod?.data?.id)
					?.map((val) => {
						setCurrentPaymentMethod(val);
					});
			} else {
				setCurrentPaymentMethod(null);
			}
		}
	}, [
		paymentMethods,
		errorPaymentMethods,
		validatingPaymentMethods,
		defaultPaymentMethod,
		errorDefaultPaymentMethod,
		validatingDefaultPaymentMethod
	]);

	useEffect(() => {
		handleCurrentPaymentMethod();
	}, [handleCurrentPaymentMethod]);

	// Handle card selection or add new card information
	const handlePaymentMethodOnCardSelection = useCallback(async () => {
		if (
			typeof currentPaymentMethod !== "undefined" &&
			currentPaymentMethod !== null &&
			Object.keys(currentPaymentMethod).length > 0
		) {
			setEnablePaymentOptions(true);
		} else {
			setEnablePaymentOptions(false);
		}
	}, [currentPaymentMethod]);

	useEffect(() => {
		handlePaymentMethodOnCardSelection();
	}, [handlePaymentMethodOnCardSelection]);

	// Handle adding new card information
	const handleAddNewCardInformation = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			setLoading(true);
		} else {
			// Disable initial loading
			setLoading(false);

			// Get all payment method elements
			const payload = await stripe.createPaymentMethod({
				type: "card",
				card: elements.getElement(CardNumberElement)
			});

			// Throw error messages into the form
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

				const paymentMethodResponse = await handlePostMethod(PaymentMethodApiEndpoint, body);
				const paymentMethodResponseData = paymentMethodResponse?.data ?? null;
				const paymentMethodResponseStatus = paymentMethodResponse?.status ?? null;
				const paymentMethodResponseMethod = paymentMethodResponse?.config?.method ?? null;

				if (paymentMethodResponseData !== null && Math.round(paymentMethodResponseStatus / 200) === 1) {
					// Disable submission as soon as 200 OK or 201 Created response was issued
					setLoading(false);

					// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
					await mutate(DefaultPaymentMethodApiEndpoint, false);

					if (asPath.includes(SubscriptionPlansSlug)) {
						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isPaymentMethod: true,
							method: paymentMethodResponseMethod,
							status: paymentMethodResponseStatus
						});
					}

					// Disable form as soon as 200 OK or 201 Created response was issued
					setDisableForm(true);
				} else {
					// Disable submission as soon as 200 OK or 201 Created response was not issued
					setLoading(false);

					if (asPath.includes(SubscriptionPlansSlug)) {
						// Show alert message after unsuccessful 200 OK or 201 Created response is issued
						setConfig({
							isPaymentMethod: true,
							method: paymentMethodResponseMethod,
							status: paymentMethodResponseStatus
						});
					}

					// Disable form as soon as 200 OK or 201 Created response was not issued
					setDisableForm(false);
				}
			}
		}
	};

	return (
		<>
			{!asPath.includes(SubscriptionPlansSlug) ? (
				state?.responses !== [] && state?.responses?.length > 0 ? (
					<div tw="fixed z-9999 right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto">
						{state?.responses?.map((value, key) => {
							// Alert Messsages
							const responseText = value?.responseText ?? null;
							const isSuccess = value?.isSuccess ?? null;

							return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
						}) ?? null}
					</div>
				) : null
			) : null}

			<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleAddNewCardInformation}>
				<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
					{!disableForm ? (
						<>
							<div tw="sm:col-span-1">
								<div tw="space-y-1 flex flex-col justify-start">
									{!enablePaymentOptions && isComponentReady ? (
										<label
											htmlFor="card-number"
											tw="inline-block text-sm text-left font-medium leading-5 text-gray-700"
										>
											{cardNumber}
										</label>
									) : (
										<label htmlFor="card-number" tw="block">
											<Skeleton duration={2} width={150} height={20} />
										</label>
									)}

									{!enablePaymentOptions && isComponentReady ? (
										<div tw="mt-1 relative rounded-md shadow-sm">
											<span
												css={[
													tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
													loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
													errorCardNumber ? tw`border-red-300` : tw`border-gray-300`
												]}
											>
												<CardNumberElement />
											</span>
										</div>
									) : (
										<div tw="mt-1">
											<Skeleton duration={2} width={360} height={38} />
										</div>
									)}
								</div>

								{errorCardNumber ? <span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardNumber}</span> : null}
							</div>

							<div tw="sm:col-span-1">
								<div tw="space-y-1 flex flex-col justify-start">
									{!enablePaymentOptions && isComponentReady ? (
										<label
											htmlFor="expiration-date"
											tw="inline-block text-sm text-left font-medium leading-5 text-gray-700"
										>
											{expirationDate}
										</label>
									) : (
										<label htmlFor="expiration-date" tw="block">
											<Skeleton duration={2} width={150} height={20} />
										</label>
									)}

									{!enablePaymentOptions && isComponentReady ? (
										<div tw="mt-1 relative rounded-md shadow-sm">
											<span
												css={[
													tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
													loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
													errorCardExpiry ? tw`border-red-300` : tw`border-gray-300`
												]}
											>
												<CardExpiryElement />
											</span>
										</div>
									) : (
										<div tw="mt-1">
											<Skeleton duration={2} width={360} height={38} />
										</div>
									)}
								</div>

								{errorCardExpiry ? <span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardExpiry}</span> : null}
							</div>

							<div tw="sm:col-span-1">
								<div tw="space-y-1 flex flex-col justify-start">
									{!enablePaymentOptions && isComponentReady ? (
										<label htmlFor="cvc" tw="inline-block text-sm text-left font-medium leading-5 text-gray-700">
											{cvc}
										</label>
									) : (
										<label htmlFor="cvc" tw="block">
											<Skeleton duration={2} width={150} height={20} />
										</label>
									)}

									{!enablePaymentOptions && isComponentReady ? (
										<div tw="mt-1 relative rounded-md shadow-sm">
											<span
												css={[
													tw`py-3 px-3.5 appearance-none border border-gray-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm`,
													loading && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
													errorCardCvc ? tw`border-red-300` : tw`border-gray-300`
												]}
											>
												<CardCvcElement />
											</span>
										</div>
									) : (
										<div tw="mt-1">
											<Skeleton duration={2} width={360} height={38} />
										</div>
									)}
								</div>

								{errorCardCvc ? <span tw="block mt-2 text-xs leading-5 text-red-700">{errorCardCvc}</span> : null}
							</div>

							<div tw="sm:col-span-1">
								<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
									<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
										<span tw="inline-flex">
											{!enablePaymentOptions && isComponentReady ? (
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
													{loading ? saving : saveChanges}
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
						</>
					) : (
						<>
							<div tw="sm:col-span-1">
								<div tw="space-y-1 flex flex-col justify-start">
									{isComponentReady ? (
										<label htmlFor="email" tw="inline-block text-sm text-left font-medium leading-5 text-gray-700">
											{subscriptionPlansDefaultCard}
										</label>
									) : (
										<label htmlFor="email" tw="block">
											<Skeleton duration={2} width={150} height={20} />
										</label>
									)}

									{isComponentReady ? (
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
												placeholder={loadingCardInformation}
												value={
													typeof currentPaymentMethod !== "undefined" &&
													currentPaymentMethod !== null &&
													Object.keys(currentPaymentMethod).length > 0
														? currentPaymentMethod?.card?.brand.charAt(0).toUpperCase() +
														  currentPaymentMethod?.card?.brand.slice(1) +
														  currentPaymentMethod
															? " - " + " " + "****" + " "
															: "" + currentPaymentMethod?.card?.last4
														: noCurrentCardRegistered
												}
												aria-describedby="cardinformation"
											/>
										</div>
									) : (
										<div tw="mt-1">
											<Skeleton duration={2} width={360} height={38} />
										</div>
									)}
								</div>
							</div>

							<div tw="sm:col-span-1">
								<div tw="flex justify-between flex-col sm:flex-row md:flex-col lg:flex-row">
									<div tw="flex justify-start order-1 sm:flex-row sm:flex-initial sm:w-auto sm:mr-1 lg:order-1 lg:w-full">
										{asPath.includes(BillingSlug) ? (
											isComponentReady ? (
												<button
													type="button"
													disabled={loading}
													css={[
														tw`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:w-auto sm:text-sm`,
														loading
															? tw`opacity-50 cursor-not-allowed`
															: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
													]}
													onClick={() => setDisableForm(!disableForm)}
												>
													{typeof currentPaymentMethod !== "undefined" &&
													currentPaymentMethod !== null &&
													Object.keys(currentPaymentMethod).length > 0
														? update
														: addCard}
												</button>
											) : (
												<Skeleton
													duration={2}
													width={82.39}
													height={38}
													tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
												/>
											)
										) : asPath.includes(SubscriptionPlansSlug) ? (
											enablePaymentOptions ? (
												isComponentReady ? (
													<button
														type="button"
														disabled={!currentPaymentMethod?.card || isProcessingPayment}
														css={[
															tw`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white sm:w-auto sm:text-sm`,
															!currentPaymentMethod?.card || isProcessingPayment
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
														]}
														onClick={
															currentPaymentMethod?.card?.length > 0 && currentPaymentMethod?.id?.length > 0
																? handlePlanSelect(planId, planName, currentPaymentMethod?.id ?? null)
																: null
														}
													>
														{isProcessingPayment ? subscriptionPlansProcessingPayment : proceed}
													</button>
												) : (
													<Skeleton
														duration={2}
														width={82.39}
														height={38}
														tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
													/>
												)
											) : isComponentReady ? (
												<button
													type="button"
													disabled={loading}
													css={[
														tw`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white sm:w-auto sm:text-sm`,
														loading
															? tw`opacity-50 cursor-not-allowed`
															: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
													]}
													onClick={() => setDisableForm(!disableForm)}
												>
													{typeof currentPaymentMethod !== "undefined" &&
													currentPaymentMethod !== null &&
													Object.keys(currentPaymentMethod).length > 0
														? update
														: addCard}
												</button>
											) : (
												<Skeleton
													duration={2}
													width={82.39}
													height={38}
													tw="w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2"
												/>
											)
										) : null}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</form>
		</>
	);
};

/**
 * Memoized custom `PaymentMethodForm` component
 */
export const MemoizedPaymentMethodForm = memo(PaymentMethodForm);
