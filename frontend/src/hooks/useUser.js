import { NoInterval } from "@configs/GlobalValues";
import useFetcher from "@hooks/useFetcher";
import useSWR from "swr";

export const useUser = (endpoint = null) => {
	const {
		data: user,
		mutate: mutateUser,
		error: errorUser,
		isValidating: validatingUser
	} = useSWR(endpoint ?? null, useFetcher, {
		refreshInterval: NoInterval,
		refreshWhenOffline: true
	});

	return { user, mutateUser, errorUser, validatingUser };
};
