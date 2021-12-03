import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the user information
 *
 * @returns {object} user, errorUser, validatingUser
 */
export const useUser = () => {
	const { data: user, error: errorUser, isValidating: validatingUser } = useMainSWRConfig(UserApiEndpoint);

	return { user, errorUser, validatingUser };
};
