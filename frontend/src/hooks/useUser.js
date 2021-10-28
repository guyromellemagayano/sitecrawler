import { UserApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";
import useSWR from "swr";

export const useUser = () => {
	const {
		data: user,
		mutate: mutateUser,
		error: errorUser,
		isValidating: validatingUser
	} = useSWR(UserApiEndpoint, useFetcher, {
		refreshWhenOffline: true
	});

	return { user, mutateUser, errorUser, validatingUser };
};
