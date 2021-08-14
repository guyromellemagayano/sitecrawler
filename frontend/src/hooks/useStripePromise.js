// External
import useSWR from "swr";

// Enums
import {
	DefaultPaymentMethodApiEndpoint,
	DefaultSubscriptionApiEndpoint,
	PaymentMethodApiEndpoint,
	StripePromiseApiEndpoint,
	SubscriptionsApiEndpoint
} from "@enums/ApiEndpoints";
import { RevalidationInterval } from "@enums/GlobalValues";

// Hooks
import useFetcher from "src/hooks/useFetcher";

export const useStripePromise = () => {
	const {
		data: stripePromise,
		mutate: mutateStripePromise,
		error: stripePromiseError
	} = useSWR(StripePromiseApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === StripePromiseApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		}
	});

	return { stripePromise, mutateStripePromise, stripePromiseError };
};

export const usePaymentMethods = ({ refreshInterval = 0 }) => {
	const {
		data: paymentMethods,
		mutate: mutatePaymentMethods,
		error: paymentMethodsError
	} = useSWR(PaymentMethodApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === PaymentMethodApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		refreshInterval: refreshInterval
	});

	return { paymentMethods, mutatePaymentMethods, paymentMethodsError };
};

export const useDefaultPaymentMethod = ({ refreshInterval = 0 }) => {
	const {
		data: defaultPaymentMethod,
		mutate: mutateDefaultPaymentMethod,
		error: defaultPaymentMethodError
	} = useSWR(DefaultPaymentMethodApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === DefaultPaymentMethodApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		refreshInterval: refreshInterval
	});

	return { defaultPaymentMethod, mutateDefaultPaymentMethod, defaultPaymentMethodError };
};

export const useSubscriptions = ({ refreshInterval = 0 }) => {
	const {
		data: subscriptions,
		mutate: mutateSubscriptions,
		error: subscriptionsError
	} = useSWR(SubscriptionsApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === SubscriptionsApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		refreshInterval: refreshInterval
	});

	return { subscriptions, mutateSubscriptions, subscriptionsError };
};

export const useDefaultSubscription = ({ refreshInterval = 0 }) => {
	const {
		data: defaultSubscription,
		mutate: mutateDefaultSubscription,
		error: defaultSubscriptionError
	} = useSWR(DefaultSubscriptionApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === DefaultSubscriptionApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		refreshInterval: refreshInterval
	});

	return { defaultSubscription, mutateDefaultSubscription, defaultSubscriptionError };
};
