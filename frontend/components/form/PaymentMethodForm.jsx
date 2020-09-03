import { useMemo } from 'react'
import styled from 'styled-components'
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from '@stripe/react-stripe-js'

const useOptions = () => {
	const options = useMemo(
		() => ({
			style: {
				base: {
					fontFamily: "Inter var, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"",
					"::placeholder": {
						color: "#aab7c4"
					},
					color: "#424770",
					letterSpacing: "0.025em",
					lineHeight: "1.25rem",
				},
				invalid: {
					color: "#9e2146"
				}
			}
		}),
	);

	return options
}

const PaymentMethodFormDiv = styled.section`
	.input-group {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}
`

const PaymentMethodForm = () => {
	const stripe = useStripe()
	const elements = useElements()
	const options = useOptions()

	const handleSubmit = async event => {
		event.preventDefault()

		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return
		}

		const payload = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardNumberElement)
		})

		console.log("[PaymentMethod]", payload)
	}

	return (
		<PaymentMethodFormDiv>
			<form onSubmit={handleSubmit}>
				<div className="input-group">
					<label htmlFor="card-number" className={`block text-sm font-medium leading-5 text-gray-700`}>Card Number</label>
					<CardNumberElement
						options={options}
						onReady={() => { console.log("CardNumberElement [ready]") }}
						onChange={(e) => { console.log("CardNumberElement [change]", e) }}
						onBlur={(e) => { console.log("CardNumberElement [blur]") }}
						onFocus={(e) => { console.log("CardNumberElement [focus]") }}
					/>
				</div>
				<div className="input-group">
					<label htmlFor="expiration-date" className={`block text-sm font-medium leading-5 text-gray-700`}>Expiration Date</label>
					<CardExpiryElement
						options={options}
						onReady={() => { console.log("CardExpiryElement [ready]") }}
						onChange={(e) => { console.log("CardExpiryElement [change]", e) }}
						onBlur={(e) => { console.log("CardExpiryElement [blur]") }}
						onFocus={(e) => { console.log("CardExpiryElement [focus]") }}
					/>
				</div>
				<div className="input-group">
					<label htmlFor="cvc" className={`block text-sm font-medium leading-5 text-gray-700`}>CVC</label>
					<CardCvcElement
						options={options}
						onReady={() => { console.log("CardCvcElement [ready]") }}
						onChange={(e) => { console.log("CardCvcElement [change]", e) }}
						onBlur={(e) => { console.log("CardCvcElement [blur]") }}
						onFocus={(e) => { console.log("CardCvcElement [focus]") }}
					/>
				</div>
				<div className={`mt-5 sm:mt-6`}>
					<span className={`flex w-full rounded-md shadow-sm sm:col-start-2`}>
						<button
							type="submit"
							className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
							disabled={!stripe}
						>
							Set Payment Method
						</button>
					</span>
				</div>
			</form>
		</PaymentMethodFormDiv>
	)
}

export default PaymentMethodForm