import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the user information
 *
 * @param {object} options
 * @returns {object} user, errorUser, validatingUser
 */
export const useUser = (options = null) => {
	const { data: user, error: errorUser, isValidating: validatingUser } = useMainSWRConfig(UserApiEndpoint, options);

	return { user, errorUser, validatingUser };
};
