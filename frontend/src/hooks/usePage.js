// External
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const usePage = ({ endpoint }) => {
	const { data: page, error: pageError } = useSWR(endpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
	});

	return { page, pageError };
};

export default usePage;
