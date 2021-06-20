// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

export const useStripePromise = () => {
	const stripePromiseApiEndpoint = "/api/stripe/config/?format=json";

	const {
		data: stripePromise,
		mutate: mutateStripePromise,
		error: stripePromiseError
	} = useSWR(stripePromiseApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === stripePromiseApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		}
	});

	return { stripePromise, mutateStripePromise, stripePromiseError };
};

export const usePaymentMethods = ({ refreshInterval = 0 }) => {
	const paymentMethodApiEndpoint = "/api/stripe/payment-method/";

	const {
		data: paymentMethods,
		mutate: mutatePaymentMethods,
		error: paymentMethodsError
	} = useSWR(paymentMethodApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === paymentMethodApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval
	});

	return { paymentMethods, mutatePaymentMethods, paymentMethodsError };
};

export const useDefaultPaymentMethod = ({ refreshInterval = 0 }) => {
	const defaultPaymentMethodApiEndpoint = "/api/stripe/payment-method/default/";

	const {
		data: defaultPaymentMethod,
		mutate: mutateDefaultPaymentMethod,
		error: defaultPaymentMethodError
	} = useSWR(defaultPaymentMethodApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === defaultPaymentMethodApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval
	});

	return { defaultPaymentMethod, mutateDefaultPaymentMethod, defaultPaymentMethodError };
};

export const useSubscriptions = ({ refreshInterval = 0 }) => {
	const subscriptionsApiEndpoint = "/api/stripe/subscription/";

	const {
		data: subscriptions,
		mutate: mutateSubscriptions,
		error: subscriptionsError
	} = useSWR(subscriptionsApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === subscriptionsApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval
	});

	return { subscriptions, mutateSubscriptions, subscriptionsError };
};

export const useDefaultSubscription = ({ refreshInterval = 0 }) => {
	const defaultSubscriptionApiEndpoint = "/api/stripe/subscription/current/";

	const {
		data: defaultSubscription,
		mutate: mutateDefaultSubscription,
		error: defaultSubscriptionError
	} = useSWR(defaultSubscriptionApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === defaultSubscriptionApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval
	});

	return { defaultSubscription, mutateDefaultSubscription, defaultSubscriptionError };
};
