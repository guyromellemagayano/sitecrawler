// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const useUser = ({ refreshInterval = 0 }) => {
	const userApiEndpoint = "/api/auth/user/";

	const { data: user, mutate: mutateUser, error: userError } = useSWR(userApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === userApiEndpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
		refreshInterval: refreshInterval,
	});

	return { user, mutateUser, userError };
};

export default useUser;
