// React
import * as React from "react";

// External
import "twin.macro";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import CardLabel from "./labels/Card.json";

// Loadable
const PaymentMethodForm = loadable(() => import("src/components/forms/PaymentMethodForm"));

const SettingsCard = (props) => {
	const [stripePromiseData, setStripePromiseData] = React.useState("");

	React.useEffect(() => {
		props.stripePublishableKey ? setStripePromiseData(loadStripe(props.stripePublishableKey)) : null;
	}, [props.stripePublishableKey]);

	return (
		<div>
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">{CardLabel[0].label}</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{CardLabel[0].description}</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<div tw="space-y-8 divide-y divide-gray-200">
					<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5">
						<Elements stripe={stripePromiseData}>
							<PaymentMethodForm
								defaultPaymentMethod={props.defaultPaymentMethod}
								paymentMethods={props.paymentMethods}
							/>
						</Elements>
					</div>
				</div>
			</div>
		</div>
	);
};

SettingsCard.propTypes = {};

export default SettingsCard;
