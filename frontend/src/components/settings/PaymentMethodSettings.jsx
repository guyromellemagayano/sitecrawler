// React
import * as React from "react";

// External
import "twin.macro";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";

// Enums
import { PaymentMethodSettingsLabels } from "@enums/PaymentMethodSettingsLabels";

// Components
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import PaymentMethodForm from "@components/forms/PaymentMethodForm";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";

const PaymentMethodSettings = ({
	componentReady,
	defaultPaymentMethod,
	mutateDefaultPaymentMethod,
	mutatePaymentMethods,
	paymentMethods,
	stripePromise
}) => {
	const [errorMsg, setErrorMsg] = React.useState([]);
	const [successMsg, setSuccessMsg] = React.useState([]);

	const stripePromiseData = React.useMemo(
		() =>
			componentReady && stripePromise
				? loadStripe(stripePromise?.publishable_key, { stripePromise })
				: null,
		[stripePromise, componentReady]
	);

	return (
		<div>
			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

			{/* TODO: Develop a separate component, settingsLabel */}
			<div tw="max-w-full p-4">
				<div tw="pt-4 m-auto">
					<h5 tw="text-xl leading-6 font-medium text-gray-900">
						{PaymentMethodSettingsLabels[0].label}
					</h5>
					<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">
						{PaymentMethodSettingsLabels[0].description}
					</p>
				</div>
			</div>

			<div tw="max-w-full lg:max-w-3xl p-4 pt-0 pb-2">
				<Elements stripe={stripePromiseData}>
					<PaymentMethodForm
						componentReady={componentReady}
						defaultPaymentMethod={defaultPaymentMethod}
						mutateDefaultPaymentMethod={mutateDefaultPaymentMethod}
						mutatePaymentMethods={mutatePaymentMethods}
						paymentMethods={paymentMethods}
						setErrorMsg={setErrorMsg}
						setSuccessMsg={setSuccessMsg}
					/>
				</Elements>
			</div>
		</div>
	);
};

PaymentMethodSettings.propTypes = {
	componentReady: PropTypes.bool,
	defaultPaymentMethod: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	mutateDefaultPaymentMethod: PropTypes.func,
	mutatePaymentMethods: PropTypes.func,
	paymentMethods: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	stripePromise: PropTypes.object
};

PaymentMethodSettings.defaultProps = {
	componentReady: false,
	defaultPaymentMethod: null,
	mutateDefaultPaymentMethod: null,
	mutatePaymentMethods: null,
	paymentMethods: null,
	stripePromise: null
};

export default PaymentMethodSettings;
