import { DefaultPaymentMethodApiEndpoint, PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { SiteCrawlerAppContext } from "@pages/_app";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { classnames } from "@utils/classnames";
import { handleConversionStringToUppercase } from "@utils/convertCase";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `CardInformationForm` component
 */
const CardInformationForm = () => {
	const [disableForm, setDisableForm] = useState(true);
	const [cardNumberError, setCardNumberError] = useState(null);
	const [cardExpiryError, setCardExpiryError] = useState(null);
	const [cardCvcError, setCardCvcError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Translations
	const { t } = useTranslation();
	const addCardText = t("settings:cardInformationSettings.addCard");
	const addingText = t("common:adding");
	const cardNumberText = t("settings:cardInformationSettings.cardNumber");
	const cvcText = t("settings:cardInformationSettings.cvc");
	const expirationDateText = t("settings:cardInformationSettings.expirationDate");
	const firstName = t("common:firstName");
	const lastName = t("common:lastName");
	const noCurrentCardRegisteredText = t("settings:cardInformationSettings.noCurrentCardRegistered");
	const requiredField = t("common:requiredField");
	const saveText = t("common:save");
	const savingText = t("common:saving");
	const subscriptionPlansDefaultCard = t("settings:subscriptionPlans.defaultCard");
	const subscriptionPlansProcessingPayment = t("settings:subscriptionPlans.processingPayment");
	const updateText = t("common:update");
	const updatingText = t("common:updating");
	const upgradePlanText = t("common:upgradePlan");
	const userName = t("common:userName");
	const loadingCardInformationText = t("settings:cardInformationSettings.loadingCardInformation");
	const cardDetailsText = t("settings:cardInformationSettings.cardDetails");
	const cancelText = t("common:cancel");

	// `currentPaymentMethod` state
	const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);

	// Custom context
	const { state, isComponentReady, paymentMethods, defaultPaymentMethod, setConfig } =
		useContext(SiteCrawlerAppContext);

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Stripe
	const stripe = useStripe();
	const elements = useElements();

	// Custom variables
	const paymentMethodsData = paymentMethods?.data ?? null;
	const defaultPaymentMethodData = defaultPaymentMethod?.data ?? null;

	// Handle `disableForm` and `currentPaymentMethod` state
	useEffect(() => {
		const selectedCurrentPaymentMethod = Array.isArray(paymentMethodsData)
			? () => {
					const dataFound =
						paymentMethodsData?.find((paymentMethod) => paymentMethod.id === defaultPaymentMethodData?.id) ?? null;

					return dataFound && Object.keys(dataFound)?.length > 0
						? handleConversionStringToUppercase(dataFound?.card?.brand?.charAt(0)) +
								dataFound?.card?.brand.slice(1) +
								" - " +
								" " +
								"****" +
								" " +
								dataFound?.card?.last4
						: noCurrentCardRegisteredText;
			  }
			: loadingCardInformationText;

		disableForm ? setCurrentPaymentMethod(selectedCurrentPaymentMethod) : null;

		return { currentPaymentMethod };
	}, [disableForm, defaultPaymentMethodData, paymentMethods]);

	// Handle form events
	const handleFormEvents = (e) => {
		const { elementType } = e;

		(async () => {
			if (stripe && elements) {
				const payload = await stripe.createPaymentMethod({
					type: "card",
					card: elements.getElement(CardNumberElement)
				});

				const cardNumberError = ["incomplete_number", "invalid_number", "incorrect_number"];
				const cardExpiryError = [
					"incomplete_expiry",
					"invalid_expiry_month_past",
					"invalid_expiry_year",
					"invalid_expiry_month"
				];
				const cardCvcError = ["incomplete_cvc", "invalid_cvc", "incorrect_cvc"];

				if (elementType === "cardNumber") {
					cardNumberError.includes(payload.error?.code)
						? setCardNumberError(payload.error?.message)
						: setCardNumberError(null);
				}

				if (elementType === "cardExpiry") {
					cardExpiryError.includes(payload.error?.code)
						? setCardExpiryError(payload.error?.message)
						: setCardExpiryError(null);
				}

				if (elementType === "cardCvc") {
					cardCvcError.includes(payload.error?.code) ? setCardCvcError(payload.error?.message) : setCardCvcError(null);
				}
			}
		})();
	};

	return !disableForm ? (
		<Formik
			initialValues={{
				cardNumber: "",
				cardExpiry: "",
				cardCvc: ""
			}}
			onSubmit={async (values) => {
				setIsSubmitting(true);

				if (stripe && elements) {
					const payload = await stripe.createPaymentMethod({
						type: "card",
						card: elements.getElement(CardNumberElement)
					});

					if (!payload.error) {
						const body = {
							id: payload.paymentMethod.id
						};

						const paymentMethodResponse = await handlePostMethod(PaymentMethodApiEndpoint, body);
						const paymentMethodResponseData = paymentMethodResponse?.data ?? null;
						const paymentMethodResponseStatus = paymentMethodResponse?.status ?? null;
						const paymentMethodResponseMethod = paymentMethodResponse?.config?.method ?? null;

						// Show alert message after successful 200 OK or 201 Created response is issued
						setConfig({
							isStripePaymentMethod: true,
							method: paymentMethodResponseMethod,
							status: paymentMethodResponseStatus,
							isAlert: false,
							isNotification: false
						});

						const paymentMethodResponseTimeout = setTimeout(() => {
							if (paymentMethodResponseData && Math.round(paymentMethodResponseStatus / 200) === 1) {
								// Mutate `defaultPaymentMethod` endpoint after successful 200 OK or 201 Created response is issued
								mutate(PaymentMethodApiEndpoint, { ...paymentMethods, data: paymentMethodResponseData }, false);
								mutate(DefaultPaymentMethodApiEndpoint);

								// Disable submission form and as soon as 200 OK or 201 Created response is issued
								setIsSubmitting(false);
								setDisableForm(!disableForm);
							} else {
								// Disable submission, reset, and disable form as soon as 200 OK or 201 Created response was not issued
								setIsSubmitting(false);
							}
						}, NotificationDisplayInterval);

						return () => {
							clearTimeout(paymentMethodResponseTimeout);
						};
					}
				}
			}}
		>
			{({ handleSubmit }) => (
				<form className="space-y-8" onSubmit={handleSubmit}>
					<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
						<div className="sm:col-span-1">
							<label htmlFor="cardNumber" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && stripe && elements ? (
									cardNumberText
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>

							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && stripe && elements ? (
									<CardNumberElement
										id="cardNumber"
										className={classnames(
											"block w-full rounded-md border border-gray-300 bg-white py-3 px-3.5 shadow-sm  focus:border-indigo-500  focus:ring-indigo-500 sm:text-sm",
											isSubmitting ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											cardNumberError ? "border-red-300" : "border-gray-300"
										)}
										onBlur={handleFormEvents}
										onChange={handleFormEvents}
									/>
								) : (
									<Skeleton duration={2} height={38} className="w-full" />
								)}
							</div>

							{cardNumberError ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{cardNumberError}</span>
							) : null}
						</div>
						<div className="sm:col-span-1">
							<label htmlFor="cardExpiry" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && stripe && elements ? (
									expirationDateText
								) : (
									<Skeleton duration={2} width={150} height={20} />
								)}
							</label>

							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && stripe && elements ? (
									<CardExpiryElement
										id="cardExpiry"
										className={classnames(
											"block w-full rounded-md border border-gray-300 bg-white py-3 px-3.5 shadow-sm  focus:border-indigo-500  focus:ring-indigo-500 sm:text-sm",
											isSubmitting ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											cardExpiryError ? "border-red-300" : "border-gray-300"
										)}
										onBlur={handleFormEvents}
										onChange={handleFormEvents}
									/>
								) : (
									<Skeleton duration={2} height={38} className="w-full" />
								)}
							</div>

							{cardExpiryError ? (
								<span className="mt-2 block text-xs leading-5 text-red-700">{cardExpiryError}</span>
							) : null}
						</div>
						<div className="sm:col-span-1">
							<label htmlFor="cardCvc" className="block text-sm font-medium leading-5 text-gray-700">
								{isComponentReady && stripe && elements ? cvcText : <Skeleton duration={2} width={150} height={20} />}
							</label>

							<div className="relative mt-1 rounded-md shadow-sm">
								{isComponentReady && stripe && elements ? (
									<CardCvcElement
										id="cardCvc"
										className={classnames(
											"block w-full rounded-md border border-gray-300 bg-white py-3 px-3.5 shadow-sm  focus:border-indigo-500  focus:ring-indigo-500 sm:text-sm",
											isSubmitting ? "cursor-not-allowed bg-gray-300 opacity-50" : null,
											cardCvcError ? "border-red-300" : "border-gray-300"
										)}
										onBlur={handleFormEvents}
										onChange={handleFormEvents}
									/>
								) : (
									<Skeleton duration={2} height={38} className="w-full" />
								)}
							</div>

							{cardCvcError ? <span className="mt-2 block text-xs leading-5 text-red-700">{cardCvcError}</span> : null}
						</div>

						{state?.isStripePaymentMethod && state?.responses?.length > 0 ? (
							<div className="sm:col-span-1">
								<div className="relative mt-1">
									{state.responses.map((value, key) => {
										// Alert Messsages
										const responseText = value.responseText;
										const isSuccess = value.isSuccess;

										return (
											<span
												key={key}
												className={classnames(
													"block break-words text-sm font-medium leading-5",
													isSuccess ? "text-green-800" : "text-red-800"
												)}
											>
												{responseText}
											</span>
										);
									})}
								</div>
							</div>
						) : null}

						<div className="sm:col-span-1">
							<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
								<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
									<span className="inline-flex">
										{isComponentReady && stripe && elements ? (
											<>
												<button
													type="button"
													disabled={isSubmitting}
													aria-disabled={isSubmitting}
													aria-hidden={isSubmitting}
													className={classnames(
														"rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm",
														isSubmitting
															? "cursor-not-allowed opacity-50"
															: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
													)}
													onClick={() => {
														setCardNumberError(null);
														setCardExpiryError(null);
														setCardCvcError(null);
														setDisableForm(!disableForm);
													}}
												>
													{cancelText}
												</button>

												<button
													type="submit"
													disabled={isSubmitting}
													aria-disabled={isSubmitting}
													aria-hidden={isSubmitting}
													className={classnames(
														"ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
														isSubmitting
															? "cursor-not-allowed opacity-50"
															: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
													)}
												>
													{isSubmitting ? savingText : saveText}
												</button>
											</>
										) : (
											<>
												<Skeleton duration={2} width={82.39} height={38} className="py-2 px-4" />
												<Skeleton duration={2} width={82.39} height={38} className="py-2 px-4" />
											</>
										)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</form>
			)}
		</Formik>
	) : (
		<div className="space-y-8 divide-y divide-gray-200">
			<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
				<div className="sm:col-span-1">
					<label htmlFor="activeCardInformation" className="block text-sm font-medium leading-5 text-gray-700">
						{isComponentReady && stripe && elements ? (
							cardDetailsText
						) : (
							<Skeleton duration={2} width={150} height={20} />
						)}
					</label>

					<div className="relative mt-1 rounded-md shadow-sm">
						{isComponentReady && stripe && elements ? (
							<div className="min-h-[38px] overflow-hidden rounded-md border border-gray-300 bg-white py-3 px-3.5 text-xs leading-5 text-gray-700 opacity-50 shadow-sm sm:text-sm">
								{currentPaymentMethod}
							</div>
						) : (
							<Skeleton duration={2} height={38} className="w-full" />
						)}
					</div>
				</div>

				<div className="sm:col-span-1">
					<div className="flex flex-col justify-between sm:flex-row md:flex-col lg:flex-row">
						<div className="order-1 flex justify-start sm:mr-1 sm:w-auto sm:flex-initial sm:flex-row lg:order-1 lg:w-full">
							<span className="inline-flex">
								{isComponentReady && stripe && elements ? (
									<button
										type="button"
										className="relative mt-3 mr-3 inline-flex w-full items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0"
										onClick={() => setDisableForm(!disableForm)}
									>
										{defaultPaymentMethodData?.id ? updateText : addCardText}
									</button>
								) : (
									<Skeleton
										duration={2}
										width={82.39}
										height={38}
										className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
									/>
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `CardInformationForm` component
 */
export const MemoizedCardInformationForm = memo(CardInformationForm);
