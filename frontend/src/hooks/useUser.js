import useFetcher from "@hooks/useFetcher";
import useSWR from "swr";

export const useUser = (endpoint = null) => {
	const {
		data: user,
		mutate: mutateUser,
		error: errorUser,
		isValidating: validatingUser
	} = useSWR(endpoint ?? null, useFetcher, {
		refreshWhenOffline: true
	});

	return { user, mutateUser, errorUser, validatingUser };
};
