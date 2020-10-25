import {
	useStripe,
	useElements,
	CardNumberElement,
	CardCvcElement,
	CardExpiryElement
} from '@stripe/react-stripe-js';
import { setTimeout } from 'core-js';
import { Transition } from '@tailwindui/react';
import { useMemo, useState, useEffect, Fragment } from 'react';
import Cookies from 'js-cookie';
import PaymentMethodFormLabel from 'public/label/components/form/PaymentMethodForm.json';
import router from 'next/router';
import styled from 'styled-components';

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

		if (response.ok && response.status === 200) {
			console.log(data);
			if (data) {
				props.closeForm();
				props.disableInputFields();
				props.successMsg();
				props.showNotificationStatus();

				setTimeout(() => {
					router.push('/dashboard/settings/profile');
				}, 1500);
			} else {
				props.errorMsg();
				props.showNotificationStatus();
			}
		} else {
			const error = new Error(response.statusText);

			error.response = response;
			error.data = data;

			setErrorMsg('An unexpected error occurred. Please try again.');
			setTimeout(() => setShowNotificationStatus(), 1500);

			throw error;
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

		updatePaymentMethod('/api/stripe/payment-method/', payload);
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
					<CardNumberElement
						options={options}
						// onReady={() => { console.log("CardNumberElement [ready]") }}
						// onChange={(e) => { console.log("CardNumberElement [change]", e) }}
						// onBlur={(e) => { console.log("CardNumberElement [blur]") }}
						// onFocus={(e) => { console.log("CardNumberElement [focus]") }}
					/>
				</div>
				<div className='input-group'>
					<label
						htmlFor='expiration-date'
						className={`block text-sm font-medium leading-5 text-gray-700`}
					>
						{PaymentMethodFormLabel[1].label}
					</label>
					<CardExpiryElement
						options={options}
						// onReady={() => { console.log("CardExpiryElement [ready]") }}
						// onChange={(e) => { console.log("CardExpiryElement [change]", e) }}
						// onBlur={(e) => { console.log("CardExpiryElement [blur]") }}
						// onFocus={(e) => { console.log("CardExpiryElement [focus]") }}
					/>
				</div>
				<div className='input-group'>
					<label
						htmlFor='cvc'
						className={`block text-sm font-medium leading-5 text-gray-700`}
					>
						{PaymentMethodFormLabel[2].label}
					</label>
					<CardCvcElement
						options={options}
						// onReady={() => { console.log("CardCvcElement [ready]") }}
						// onChange={(e) => { console.log("CardCvcElement [change]", e) }}
						// onBlur={(e) => { console.log("CardCvcElement [blur]") }}
						// onFocus={(e) => { console.log("CardCvcElement [focus]") }}
					/>
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
