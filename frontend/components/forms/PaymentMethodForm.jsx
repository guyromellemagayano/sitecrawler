import { DefaultPaymentMethodApiEndpoint, PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { BillingSlug, SubscriptionPlansSlug } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { CreditCardIcon } from "@heroicons/react/solid";
import { useDefaultPaymentMethod } from "@hooks/useDefaultPaymentMethod";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { usePaymentMethods } from "@hooks/usePaymentMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

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

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { paymentMethods, errorPaymentMethods } = usePaymentMethods();
	const { defaultPaymentMethod, errorDefaultPaymentMethod } = useDefaultPaymentMethod();

	// Custom hooks
	const { setConfig } = useNotificationMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Stripe
	const stripe = useStripe();
	const elements = useElements();

	// Handle `currentPaymentMethod` state
	const handleCurrentPaymentMethod = useCallback(async () => {
		if (!errorPaymentMethods && paymentMethods && !errorDefaultPaymentMethod && defaultPaymentMethod) {
			paymentMethods?.data
				?.filter((paymentMethod) => paymentMethod.id === defaultPaymentMethod?.data?.id)
				?.map((val) => {
					setCurrentPaymentMethod(val);
				});
		} else {
			setCurrentPaymentMethod(null);
		}
	}, [paymentMethods, errorPaymentMethods, defaultPaymentMethod, errorDefaultPaymentMethod]);

	useEffect(() => {
		handleCurrentPaymentMethod();
	}, [handleCurrentPaymentMethod]);

	// Handle card selection or add new card information
	const handlePaymentMethodOnCardSelection = useCallback(async () => {
		if (currentPaymentMethod && Object.keys(currentPaymentMethod).length > 0) {
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
					mutate(DefaultPaymentMethodApiEndpoint);

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
		<form className="space-y-8 divide-y divide-gray-200" onSubmit={handleAddNewCardInformation}>
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
				{!disableForm ? (
					<>
						<div className="sm:col-span-1">
							<div className="flex flex-col justify-start space-y-1">
								{!enablePaymentOptions && isComponentReady ? (
									<label
										htmlFor="card-number"
										className="inline-block text-left text-sm font-medium leading-5 text-gray-700"
									>
										{cardNumber}
									</label>
								) : (
									<label htmlFor="card-number" className="block">
										<Skeleton duration={2} width={150} height={20} />
									</label>
								)}

								{!enablePaymentOptions && isComponentReady ? (
									<div className="relative mt-1 rounded-md shadow-sm">
										<span
											className={classnames(
												"block w-full appearance-none rounded-md border border-gray-500 py-3 px-3.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												loading && "cursor-not-allowed bg-gray-300 opacity-50",
												errorCardNumber ? "border-red-300" : "border-gray-300"
											)}
										>
											<CardNumberElement />
										</span>
									</div>
								) : (
									<div className="mt-1">
										<Skeleton duration={2} width={360} height={38} />
									</div>
								)}
							</div>

							{errorCardNumber ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errorCardNumber}</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-start space-y-1">
								{!enablePaymentOptions && isComponentReady ? (
									<label
										htmlFor="expiration-date"
										className="inline-block text-left text-sm font-medium leading-5 text-gray-700"
									>
										{expirationDate}
									</label>
								) : (
									<label htmlFor="expiration-date" className="block">
										<Skeleton duration={2} width={150} height={20} />
									</label>
								)}

								{!enablePaymentOptions && isComponentReady ? (
									<div className="relative mt-1 rounded-md shadow-sm">
										<span
											className={classnames(
												"block w-full appearance-none rounded-md border border-gray-500 py-3 px-3.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												loading && "cursor-not-allowed bg-gray-300 opacity-50",
												errorCardExpiry ? "border-red-300" : "border-gray-300"
											)}
										>
											<CardExpiryElement />
										</span>
									</div>
								) : (
									<div className="mt-1">
										<Skeleton duration={2} width={360} height={38} />
									</div>
								)}
							</div>

							{errorCardExpiry ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{errorCardExpiry}</span>
							) : null}
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-start space-y-1">
								{!enablePaymentOptions && isComponentReady ? (
									<label htmlFor="cvc" className="inline-block text-left text-sm font-medium leading-5 text-gray-700">
										{cvc}
									</label>
								) : (
									<label htmlFor="cvc" className="block">
										<Skeleton duration={2} width={150} height={20} />
									</label>
								)}

								{!enablePaymentOptions && isComponentReady ? (
									<div className="relative mt-1 rounded-md shadow-sm">
										<span
											className={classnames(
												"block w-full appearance-none rounded-md border border-gray-500 py-3 px-3.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												loading && "cursor-not-allowed bg-gray-300 opacity-50",
												errorCardCvc ? "border-red-300" : "border-gray-300"
											)}
										>
											<CardCvcElement />
										</span>
									</div>
								) : (
									<div className="mt-1">
										<Skeleton duration={2} width={360} height={38} />
									</div>
								)}
							</div>

							{errorCardCvc ? <span className="mt-2 block text-xs leading-5 text-red-700">{errorCardCvc}</span> : null}
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{!enablePaymentOptions && isComponentReady ? (
											<button
												type="submit"
												disabled={loading}
												className={classnames(
													"relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0",
													loading
														? "cursor-not-allowed opacity-50"
														: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
												)}
											>
												{loading ? saving : saveChanges}
											</button>
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												className="relative mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
											/>
										)}
									</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="sm:col-span-1">
							<div className="flex flex-col justify-start space-y-1">
								{isComponentReady ? (
									<label htmlFor="email" className="inline-block text-left text-sm font-medium leading-5 text-gray-700">
										{subscriptionPlansDefaultCard}
									</label>
								) : (
									<label htmlFor="email" className="block">
										<Skeleton duration={2} width={150} height={20} />
									</label>
								)}

								{isComponentReady ? (
									<div className="relative mt-1 rounded-md shadow-sm">
										<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
											<CreditCardIcon className="h-4 w-4 text-gray-400" />
										</div>

										<input
											type="text"
											disabled={disableForm}
											id="cardinformation"
											className={classnames(
												"block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
												disableForm && "cursor-not-allowed bg-gray-300 opacity-50"
											)}
											placeholder={loadingCardInformation}
											value={
												currentPaymentMethod && Object.keys(currentPaymentMethod).length > 0
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
									<div className="mt-1">
										<Skeleton duration={2} width={360} height={38} />
									</div>
								)}
							</div>
						</div>

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									{asPath.includes(BillingSlug) ? (
										isComponentReady ? (
											<button
												type="button"
												disabled={loading}
												className={classnames(
													"inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:w-auto sm:text-sm",
													loading
														? "cursor-not-allowed opacity-50"
														: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												)}
												onClick={() => setDisableForm(!disableForm)}
											>
												{currentPaymentMethod && Object.keys(currentPaymentMethod).length > 0 ? update : addCard}
											</button>
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												className="relative mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
											/>
										)
									) : asPath.includes(SubscriptionPlansSlug) ? (
										enablePaymentOptions ? (
											isComponentReady ? (
												<button
													type="button"
													disabled={!currentPaymentMethod?.card || isProcessingPayment}
													className={classnames(
														"inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:w-auto sm:text-sm",
														!currentPaymentMethod?.card || isProcessingPayment
															? "cursor-not-allowed opacity-50"
															: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
													)}
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
													className="relative mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
												/>
											)
										) : isComponentReady ? (
											<button
												type="button"
												disabled={loading}
												className={classnames(
													"inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:w-auto sm:text-sm",
													loading
														? "cursor-not-allowed opacity-50"
														: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												)}
												onClick={() => setDisableForm(!disableForm)}
											>
												{currentPaymentMethod && Object.keys(currentPaymentMethod).length > 0 ? update : addCard}
											</button>
										) : (
											<Skeleton
												duration={2}
												width={82.39}
												height={38}
												className="relative mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
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
	);
};

/**
 * Memoized custom `PaymentMethodForm` component
 */
export const MemoizedPaymentMethodForm = memo(PaymentMethodForm);
