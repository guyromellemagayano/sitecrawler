import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "twin.macro";

export const Layout = ({ children }) => {
	// Router
	const router = useRouter();

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);
	}, []);

	return <main tw="h-screen">{children}</main>;
};
