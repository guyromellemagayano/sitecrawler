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
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === userApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
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
