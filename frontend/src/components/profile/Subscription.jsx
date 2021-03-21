// React
import { useState, useMemo, useEffect } from 'react';

// External
import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';
import useSWR from 'swr';

// JSON
import SubscriptionLabel from 'public/labels/pages/subscriptions.json';
import PaymentMethodFormLabel from 'public/labels/components/form/PaymentMethodForm.json';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

// Components
const ErrorNotificationOverlay = loadable(() =>
	import('src/components/overlay/ErrorNotificationOverlay')
);
const PaymentMethodForm = loadable(() =>
	import('src/components/form/PaymentMethodForm')
);
const SuccessNotificationOverlay = loadable(() =>
	import('src/components/overlay/SuccessNotificationOverlay')
);

const useOptions = () => {
	const options = useMemo(() => ({
		style: {
			base: {
				'fontFamily':
					'Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
				'::placeholder': {
					color: '#aab7c4'
				},
				'color': '#424770',
				'letterSpacing': '0.025em',
				'lineHeight': '1.25rem'
			},
			invalid: {
				color: '#9e2146'
			}
		}
	}));

	return options;
};

const ProfileSettingsSubscription = () => {
	const [disableForm, setDisableForm] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();

	const paymentMethodApiEndpoint = '/api/stripe/payment-method/';
	const defaultPaymentMethodApiEndpoint = '/api/stripe/payment-method/default/';

	const { data: paymentMethods } = useSWR(
		() => paymentMethodApiEndpoint,
		useFetcher,
		{
			refreshInterval: 3000
		}
	);

	const { data: currentPaymentMethod } = useSWR(
		() => defaultPaymentMethodApiEndpoint,
		useFetcher,
		{
			refreshInterval: 3000
		}
	);

	useEffect(() => {
		if (
			paymentMethods !== '' &&
			paymentMethods !== undefined &&
			currentPaymentMethod !== '' &&
			currentPaymentMethod !== undefined
		) {
			paymentMethods
				.filter((paymentMethod) => paymentMethod.id === currentPaymentMethod.id)
				.map((val) => {
					setPaymentMethod(val);
				});
		}
	}, [paymentMethods, currentPaymentMethod]);

	const handleEditPaymentMethod = (e) => {
		e.preventDefault();

		setDisableInputFields(!disableInputFields);
	};

	const handlePaymentMethodModal = (e) => {
		e.preventDefault();

		setShowModal(!showModal);
	};

	return (
		<div>
			<SuccessNotificationOverlay
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={SubscriptionLabel[17].label}
			/>
			<ErrorNotificationOverlay
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={SubscriptionLabel[18].label}
			/>

			<div tw='max-w-full py-4 px-8'>
				<div tw='pt-4 m-auto'>
					<h5 tw='text-xl leading-6 font-medium text-gray-900'>
						{SubscriptionLabel[5].label}
					</h5>
					<p tw='max-w-full mt-2 text-sm leading-5 text-gray-500'>
						{SubscriptionLabel[5].description}
					</p>
				</div>
			</div>
			<div tw='max-w-full lg:max-w-3xl p-8 pt-0 pb-2'>
				<div tw='space-y-8 divide-y divide-gray-200'>
					<div tw='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-5'>
						<div tw='sm:col-span-4'>
							<label
								htmlFor='paymentMethod'
								tw='block text-sm font-medium leading-5 text-gray-700'
							>
								{SubscriptionLabel[6].label}
							</label>
						</div>
						<div tw='mt-1 flex rounded-md shadow-sm'>
							{/* Payment Method Form */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

ProfileSettingsSubscription.propTypes = {};

export default ProfileSettingsSubscription;
