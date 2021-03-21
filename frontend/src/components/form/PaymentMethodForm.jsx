import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js';
import { useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import PaymentMethodFormLabel from 'public/labels/components/form/PaymentMethodForm.json';
import router from 'next/router';
import tw from 'twin.macro';
import useSWR from 'swr';

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

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

const PaymentMethodFormDiv = styled.section`
	.input-group {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
`;

const PaymentMethodForm = (props) => {
	const stripe = useStripe();
	const elements = useElements();
	const options = useOptions();
	const [loading, setLoading] = useState(false);

	const updatePaymentMethod = async (endpoint, payload) => {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			},
			body: JSON.stringify({ id: payload.paymentMethod.id })
		});

		const data = await response.json();

		if (response.ok && response.status === 200 && data) {
			props.closeForm();
			props.disableInputFields();
			props.successMsg();
			props.showNotificationStatus();

			setTimeout(() => {
				router.push('/dashboard/settings/profile');
			}, 2000);

			// console.log(data);
		} else {
			props.errorMsg();
			props.showNotificationStatus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		setLoading(true);

		const payload = await stripe.createPaymentMethod({
			type: 'card',
			card: elements.getElement(CardNumberElement)
		});

		// console.log('[PaymentMethod]', payload);

		if (payload.error) {
			if (payload.error.code === 'incomplete_number') {
				alert('ERROR: ' + payload.error.message);
			}

			if (payload.error.code === 'incomplete_expiry') {
				alert('ERROR: ' + payload.error.message);
			}

			if (payload.error.code === 'incomplete_cvc') {
				alert('ERROR: ' + payload.error.message);
			}

			setLoading(false);
		} else {
			updatePaymentMethod('/api/stripe/payment-method/', payload);
		}
	};

	return (
		<PaymentMethodFormDiv>
			<form onSubmit={handleSubmit}>
				<div className='input-group'>
					<label
						htmlFor='card-number'
						className={`block text-sm font-medium leading-5 text-gray-700`}
					>
						{PaymentMethodFormLabel[0].label}
					</label>
					<CardNumberElement options={options} />
				</div>
				<div className='input-group'>
					<label
						htmlFor='expiration-date'
						className={`block text-sm font-medium leading-5 text-gray-700`}
					>
						{PaymentMethodFormLabel[1].label}
					</label>
					<CardExpiryElement options={options} />
				</div>
				<div className='input-group'>
					<label
						htmlFor='cvc'
						className={`block text-sm font-medium leading-5 text-gray-700`}
					>
						{PaymentMethodFormLabel[2].label}
					</label>
					<CardCvcElement options={options} />
				</div>
				<div className={`mt-5 sm:mt-6`}>
					<span className={`flex w-full rounded-md shadow-sm sm:col-start-2`}>
						<button
							type='submit'
							className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
								loading
									? 'opacity-50 bg-indigo-300 cursor-not-allowed'
									: 'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo'
							}`}
							disabled={loading ? true : false}
						>
							{loading ? 'Saving Changes...' : PaymentMethodFormLabel[3].label}
						</button>
					</span>
				</div>
			</form>
		</PaymentMethodFormDiv>
	);
};

export default PaymentMethodForm;
