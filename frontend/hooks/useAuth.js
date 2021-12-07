/* eslint-disable react-hooks/exhaustive-deps */
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { useUser } from "@hooks/useUser";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	// Router
	const { pathname } = useRouter();
	const router = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// User authentication
	const authenticate = useCallback(async () => {
		// If user is not authenticated, redirect to login page
		if (!validatingUser) {
			if (
				!errorUser &&
				typeof user !== "undefined" &&
				user !== null &&
				Object.keys(user)?.length > 0 &&
				Math.round(user?.status / 200 === 1)
			) {
				if (!pathname.includes(DashboardSlug)) {
					router.push(DashboardSitesLink);
				} else {
					return;
				}
			} else {
				router.push(LoginLink);
			}
		}
	}, [validatingUser, errorUser, user, pathname]);

	useEffect(() => {
		return authenticate();
	}, [authenticate]);

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
