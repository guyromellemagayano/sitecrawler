import { MemoizedPaymentMethodForm } from "@components/forms/PaymentMethodForm";
import { useLoading } from "@hooks/useLoading";
import { useStripePromise } from "@hooks/useStripePromise";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useTranslation from "next-translate/useTranslation";
import { memo, useCallback, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `PaymentMethodSettings` component
 */
export function PaymentMethodSettings() {
	// Translations
	const { t } = useTranslation("settings");
	const cardInformationTitle = t("settings:cardInformationSettings.title");

	// SWR hooks
	const { stripePromise, errorStripePromise, validatingStripePromise } = useStripePromise();

	// Set `stripe` promise
	const [stripePromiseData, setStripePromiseData] = useState(null);

	// Custom hooks
	const { isComponentReady } = useLoading();

	// Handle `stripe` promise
	const handleStripePromise = useCallback(async () => {
		if (!validatingStripePromise) {
			if (!errorStripePromise && typeof stripePromise !== "undefined" && stripePromise !== null) {
				const stripePromisePublishableKey = await stripePromise?.data?.publishable_key;

				setStripePromiseData(loadStripe(stripePromisePublishableKey, { stripePromise }));
			}
		}
	}, [stripePromise, validatingStripePromise, errorStripePromise]);

	useEffect(() => {
		handleStripePromise();
	}, [handleStripePromise]);

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
				{isComponentReady ? cardInformationTitle : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<Elements stripe={stripePromiseData}>
				<MemoizedPaymentMethodForm />
			</Elements>
		</div>
	);
}

/**
 * Memoized custom `PaymentMethodSettings` component
 */
export const MemoizedPaymentMethodSettings = memo(PaymentMethodSettings);
