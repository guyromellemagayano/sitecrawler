/* eslint-disable react-hooks/exhaustive-deps */
import { DashboardSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import { MemoizedDashboardLayout } from "./components/Dashboard";
import { MemoizedStaticLayout } from "./components/Static";

/**
 * Custom function to render the `Layout` component
 *
 * @param {any} children
 */
export const Layout = ({ children }) => {
	// Router
	const { asPath } = useRouter();

	return asPath.includes(DashboardSlug) ? (
		<MemoizedDashboardLayout>{children}</MemoizedDashboardLayout>
	) : (
		<MemoizedStaticLayout>{children}</MemoizedStaticLayout>
	);
};

Layout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `Layout` component
 */
export const MemoizedLayout = memo(Layout);
