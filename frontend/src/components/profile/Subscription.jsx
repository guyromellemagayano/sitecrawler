// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import SubscriptionLabel from "public/labels/pages/subscriptions.json";

// Hooks
import { useStripePromise } from "src/hooks/useStripePromise";

// Components
const PaymentMethodForm = loadable(() => import("src/components/forms/PaymentMethodForm"));
const SettingsSubscriptionSkeleton = loadable(() => import("src/components/skeletons/SettingsSubscriptionSkeleton"));

const SettingsSubscription = ({ user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [stripePromiseData, setStripePromiseData] = useState("");

	const { stripePromise: stripePromise, stripePromiseError: stripePromiseError } = useStripePromise();

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			stripePromise &&
			stripePromise !== [] &&
			Object.keys(stripePromise).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);

			setStripePromiseData(stripePromise.publishable_key);
		}
	}, [user, stripePromise]);

	return componentReady ? (
		<div>
			<div tw="max-w-full py-4 px-8">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{SubscriptionLabel[5].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{SubscriptionLabel[5].description}</p>
				</div>
			</div>
			<div tw="max-w-full lg:max-w-3xl p-8 pt-0 pb-2">
				<Elements stripe={loadStripe(stripePromiseData)}>
					<PaymentMethodForm />
				</Elements>
			</div>
		</div>
	) : (
		<SettingsSubscriptionSkeleton />
	);
};

SettingsSubscription.propTypes = {};

export default SettingsSubscription;
