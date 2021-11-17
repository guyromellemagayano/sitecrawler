import { DefaultSubscriptionApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

export const useDefaultSubscription = () => {
	const {
		data: defaultSubscription,
		mutate: mutateDefaultSubscription,
		error: defaultSubscriptionError
	} = useSWR(DefaultSubscriptionApiEndpoint);

	return { defaultSubscription, mutateDefaultSubscription, defaultSubscriptionError };
};
