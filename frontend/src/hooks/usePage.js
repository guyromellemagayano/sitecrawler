// External
import useSWR from "swr";

// Hooks
import { RevalidationInterval } from "@enums/GlobalValues";
import useFetcher from "@hooks/useFetcher";

const usePage = ({ endpoint }) => {
	const { data: page, error: pageError } = useSWR(endpoint ? endpoint : null, useFetcher, {
		onErrorRetry: (error, key, revalidate, { retryCount }) => {
			if (error && error !== undefined && error.status === 404) return;
			if (key === endpoint) return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), RevalidationInterval);
		}
	});

	return { page, pageError };
};

export default usePage;
