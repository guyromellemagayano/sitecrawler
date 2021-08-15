// NextJS
import { useRouter } from "next/router";

// External
import useSWR from "swr";

import { RevalidationInterval } from "@enums/GlobalValues";

// Hooks
import { UserApiEndpoint } from "@enums/ApiEndpoints";
import useFetcher from "@hooks/useFetcher";

const useUser = ({ redirectIfFound = false, redirectTo = "", refreshInterval = 0 }) => {
	const router = useRouter();

	const {
		data: user,
		mutate: mutateUser,
		error: userError
	} = useSWR(UserApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === UserApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		},
		onSuccess: (data) => {
			if (data !== undefined && Object.keys(data).length > 0 && !redirectIfFound) {
				return;
			} else {
				router.push({ pathname: redirectTo });
			}
		},
		refreshInterval: refreshInterval
	});

	return { user, mutateUser, userError };
};

export default useUser;
