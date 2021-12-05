import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import { LoginLink } from "@constants/PageLinks";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useUser } from "@hooks/useUser";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Select page component in the current `children` array
	const PageComponent = children?.[3]?.type;

	// Router
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Callback for logging out
	const logout = useCallback(
		async ({ redirectRoute }) => {
			const response = await handlePostMethod(LogoutApiEndpoint);
			const data = response?.data ?? null;
			const status = response?.status ?? null;

			if (
				typeof data !== "undefined" &&
				data !== null &&
				data?.detail &&
				Object.keys(data)?.length > 0 &&
				Math.round(status / 200 === 1)
			) {
				// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
				mutate(UserApiEndpoint);

				// Redirect to login page
				router.push(redirectRoute ?? LoginLink);
			}
		},
		[mutate, router]
	);

	// Callback for user authentication
	const authenticate = useCallback(() => {
		// If user is not authenticated, redirect to login page
		if (!validatingUser) {
			if (
				!errorUser &&
				typeof user !== "undefined" &&
				user !== null &&
				Object.keys(user)?.length > 0 &&
				Math.round(user?.status / 200 === 1)
			) {
				setIsAuthenticated(true);
				setIsLoading(false);
			} else {
				setIsAuthenticated(false);

				// If user is not authenticated, redirect to login page
				return logout({ redirectRoute: PageComponent?.redirectUnauthenticatedTo });
			}
		}
	}, [validatingUser, errorUser, user, logout, PageComponent]);

	useEffect(() => {
		// If it doesn't require authentication, don't do anything
		if (!PageComponent?.requiresAuth) return;

		// If user is authenticated, don't do anything
		if (isAuthenticated) return;

		// If user is not authenticated, reauthenticate
		if (!isLoading) {
			authenticate();
		}
	}, [isLoading, isAuthenticated, logout, authenticate, PageComponent]);

	return <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
