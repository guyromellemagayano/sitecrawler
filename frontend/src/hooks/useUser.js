// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const useUser = ({ redirectIfFound = false, redirectTo = "", refreshInterval = 0 }) => {
	const userApiEndpoint = "/api/auth/user/";

	const router = useRouter();

	const {
		data: user,
		mutate: mutateUser,
		error: userError
	} = useSWR(userApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === userApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval,
		dedupingInterval: 0
	});

	React.useEffect(() => {
		if (userError && !redirectIfFound) {
			if (userError.status === 403) {
				router.push({ pathname: redirectTo });
			}
		}

		if (user !== undefined && Object.keys(user).length > 0 && redirectIfFound) {
			if ("key" in user) {
				router.push(redirectTo);
			}
		} else {
			return;
		}
	}, [user, userError, redirectIfFound, redirectTo]);

	return { user, mutateUser, userError };
};

export default useUser;
