import { UserApiEndpoint } from "@configs/ApiEndpoints";
import useSWR from "swr";

/**
 * SWR React hook that will handle the user information
 *
 * @returns {object} data, error, isValidating
 */
export const useUser = () => {
	const { data: user, error: errorUser, isValidating: validatingUser } = useSWR(UserApiEndpoint);

	return { user, errorUser, validatingUser };
};
