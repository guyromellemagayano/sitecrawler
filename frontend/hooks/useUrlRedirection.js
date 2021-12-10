/* eslint-disable react-hooks/exhaustive-deps */
import { DashboardSitesLink, DashboardSlug, LoginLink, LogoutSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useUser } from "./useUser";

/**
 * Custom hook that will handle the url redirection when the user is either logged in or logged out.
 */
export const useUrlRedirection = () => {
	const { user, errorUser, validatingUser } = useUser();

	// Router
	const { pathname } = useRouter();
	const router = useRouter();

	// Handle the redirection
	const handleUrlRedirection = useCallback(async () => {
		if (!validatingUser) {
			if (!errorUser && user) {
				if (pathname.indexOf(DashboardSlug) > -1 || pathname.indexOf(LogoutSlug) > -1) {
					return;
				} else {
					router.push(DashboardSitesLink);
				}
			} else {
				if (pathname.indexOf(DashboardSlug) > -1) {
					router.push(LoginLink);
				} else {
					return;
				}
			}
		}
	}, [user, errorUser, validatingUser, pathname]);

	useEffect(() => {
		handleUrlRedirection();
	}, [handleUrlRedirection]);
};
