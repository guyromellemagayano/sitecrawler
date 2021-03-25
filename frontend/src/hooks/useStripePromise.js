// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

export const useStripePromise = () => {
	const stripePromiseApiEndpoint = "/api/stripe/config/";

	const { data: stripePromise, error: stripePromiseError } = useSWR(stripePromiseApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === stripePromiseApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
	});

	return { stripePromise, stripePromiseError };
};

export const usePaymentMethod = ({ refreshInterval = 0 }) => {
	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const { data: paymentMethod, error: paymentMethodError } = useSWR(paymentMethodApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval,
	});

	return { paymentMethod, paymentMethodError };
};

export const useDefaultPaymentMethod = ({ refreshInterval = 0 }) => {
	const defaultPaymentMethodApiEndpoint = "/api/stripe/payment-method/default/";

	const { data: defaultPaymentMethod, error: defaultPaymentMethodError } = useSWR(
		defaultPaymentMethodApiEndpoint,
		useFetcher,
		{
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				if (error.status === 404) return;
				if (key === defaultPaymentMethodApiEndpoint) return;
				if (retryCount >= 10) return;

				setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
			},
			refreshInterval: refreshInterval,
		}
	);

	return { defaultPaymentMethod, defaultPaymentMethodError };
};
