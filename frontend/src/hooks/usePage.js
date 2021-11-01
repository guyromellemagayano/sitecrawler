import { EndpointRefreshInterval } from "@configs/GlobalValues";
import useFetcher from "@hooks/useFetcher";
import useSWR from "swr";
import { useUser } from "./useUser";

const usePage = ({ endpoint = null }) => {
	const { user } = useUser();

	const {
		data: page,
		mutate: mutatePage,
		error: pageError,
		isValidating: validatingPage
	} = useSWR(
		user && user !== null && typeof user === "object" && !Object.keys(user).includes("detail")
			? endpoint !== null
				? endpoint
				: null
			: null,
		useFetcher,
		{
			refreshInterval: EndpointRefreshInterval
		}
	);

	return { page, mutatePage, validatingPage, pageError };
};

export default usePage;
