import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the user information
 *
 * @param {object} options
 * @returns {object} user, errorUser, validatingUser
 */
export const useUser = (endpoint = null, options = null) => {
	// SWR hook
	const { data: user, error: errorUser, isValidating: validatingUser } = useMainSWRConfig(endpoint, options);

	return {
		user,
		errorUser,
		validatingUser
	};
};
