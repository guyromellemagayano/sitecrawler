/* eslint-disable react-hooks/exhaustive-deps */
import { DefaultPaymentMethodApiEndpoint, PaymentMethodApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { CreditCardIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { classnames } from "@utils/classnames";
import { handleConversionStringToUppercase } from "@utils/convertCase";
import { Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useContext, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `PaymentMethodModal` component
 *
 * @param {function} handlePlanSelect
 * @param {boolean} showModal
 * @param {function} setShowModal
 * @param {number} planId
 * @param {string} planName
 * @param {boolean} isProcessingPayment
 * @param {any} currentPaymentMethod
 * @param {function} setCurrentPaymentMethod
 */
const PaymentMethodModal = (
	{
		handlePlanSelect,
		showModal = false,
		setShowModal,
		planId = null,
		planName = null,
		isProcessingPayment = false,
		currentPaymentMethod,
		setCurrentPaymentMethod
	},
	ref
) => {
	const [enablePaymentOptions, setEnablePaymentOptions] = useState(false);
	const [disableForm, setDisableForm] = useState(true);
	const [cardNumberError, setCardNumberError] = useState(null);
	const [cardExpiryError, setCardExpiryError] = useState(null);
	const [cardCvcError, setCardCvcError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Router
	const { asPath } = useRouter();

	// Translations
	const { t } = useTranslation();
	const subscriptionPlansUpgradePlanLabel = t("settings:subscriptionPlans.upgradePlan.label");
	const subscriptionPlansUpgradePlanDescription = t("settings:subscriptionPlans.upgradePlan.description");
	const updateCardText = t("settings:cardInformationSettings.updateCard");
	const addCardText = t("settings:cardInformationSettings.addCard");
	const addingText = t("common:adding");
	const cancelText = t("common:cancel");
	const cardDetailsText = t("settings:cardInformationSettings.cardDetails");
	const cardNumberText = t("settings:cardInformationSettings.cardNumber");
	const closeText = t("common:close");
	const cvcText = t("settings:cardInformationSettings.cvc");
	const expirationDateText = t("settings:cardInformationSettings.expirationDate");
	const firstName = t("common:firstName");
	const lastName = t("common:lastName");
	const noCurrentCardRegisteredText = t("settings:cardInformationSettings.noCurrentCardRegistered");
	const requiredField = t("common:requiredField");
	const saveText = t("common:save");
	const savingText = t("common:saving");
	const processingPaymentText = t("settings:subscriptionPlans.processingPayment");
	const loadingCardInformationText = t("settings:cardInformationSettings.loadingCardInformation");
	const upgradePlanText = t("common:upgradePlan");
	const userName = t("common:userName");

	// Custom context
	const { isComponentReady, state, paymentMethods, defaultPaymentMethod, setConfig } =
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

	// Custom hooks
	const paymentMethodRef = useRef(null);

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={paymentMethodRef}
				onClose={isProcessingPayment || !disableForm ? () => {} : handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center p-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
									<CreditCardIcon className="h-5 w-5 text-green-600" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="block text-lg font-medium text-gray-900">
										{subscriptionPlansUpgradePlanLabel}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="mt-4 mb-3 block text-sm text-gray-500">
											{subscriptionPlansUpgradePlanDescription}
										</Dialog.Description>
									</div>

									{!disableForm ? (
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
																mutate(
																	PaymentMethodApiEndpoint,
																	{ ...paymentMethods, data: paymentMethodResponseData },
																	{ optimisticData: paymentMethods?.data, rollbackOnError: true, revalidate: true }
																);
																mutate(DefaultPaymentMethodApiEndpoint, null, {
																	optimisticData: defaultPaymentMethod?.data,
																	rollbackOnError: true,
																	revalidate: true
																});

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
												<form onSubmit={handleSubmit}>
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
																{isComponentReady && stripe && elements ? (
																	cvcText
																) : (
																	<Skeleton duration={2} width={150} height={20} />
																)}
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

															{cardCvcError ? (
																<span className="mt-2 block text-xs leading-5 text-red-700">{cardCvcError}</span>
															) : null}
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

														<div className="mt-5 sm:mt-0 sm:flex sm:flex-row-reverse">
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
																			onClick={
																				isSubmitting
																					? () => {}
																					: () => {
																							setCardNumberError(null);
																							setCardExpiryError(null);
																							setCardCvcError(null);
																							setDisableForm(!disableForm);
																					  }
																			}
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
												</form>
											)}
										</Formik>
									) : (
										<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
											<div className="sm:col-span-1">
												<label
													htmlFor="activeCardInformation"
													className="block text-sm font-medium leading-5 text-gray-700"
												>
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

											{state?.responses?.length > 0 ? (
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

											<div className="mt-5 sm:mt-0 sm:flex sm:flex-row-reverse">
												{isComponentReady && stripe && elements ? (
													<span className="inline-flex">
														<button
															type="button"
															disabled={isProcessingPayment}
															aria-disabled={isProcessingPayment}
															aria-hidden={isProcessingPayment}
															className={classnames(
																"rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm",
																isProcessingPayment
																	? "cursor-not-allowed opacity-50"
																	: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
															)}
															onClick={isProcessingPayment ? () => {} : handleCloseModal}
														>
															{closeText}
														</button>

														<button
															ref={paymentMethodRef}
															type="button"
															disabled={isProcessingPayment}
															aria-disabled={isProcessingPayment}
															aria-hidden={isProcessingPayment}
															className={classnames(
																"ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
																isProcessingPayment
																	? "cursor-not-allowed opacity-50"
																	: "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
															)}
															onClick={isProcessingPayment ? () => {} : () => setDisableForm(!disableForm)}
														>
															{defaultPaymentMethod?.data?.id ? updateCardText : addCardText}
														</button>

														{defaultPaymentMethod?.data?.id ? (
															<button
																type="button"
																disabled={isProcessingPayment}
																aria-disabled={isProcessingPayment}
																aria-hidden={isProcessingPayment}
																className={classnames(
																	"ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm",
																	isProcessingPayment
																		? "cursor-not-allowed opacity-50"
																		: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
																)}
																onClick={isProcessingPayment ? () => {} : () => handlePlanSelect(planId, planName)}
															>
																{isProcessingPayment ? processingPaymentText : upgradePlanText}
															</button>
														) : null}
													</span>
												) : (
													<span className="inline-flex">
														<Skeleton
															duration={2}
															width={82.39}
															height={38}
															className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
														/>

														<Skeleton
															duration={2}
															width={82.39}
															height={38}
															className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
														/>

														<Skeleton
															duration={2}
															width={82.39}
															height={38}
															className="mt-3 mr-3 inline-flex w-full items-center px-4 py-2 sm:mt-0"
														/>
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `PaymentMethodModal` component
 */
const ForwardRefPaymentMethodModal = forwardRef(PaymentMethodModal);
export const MemoizedPaymentMethodModal = memo(ForwardRefPaymentMethodModal);
