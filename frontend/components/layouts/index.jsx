import { MemoizedAddSite } from "@components/sites/AddSite";
import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useRouter } from "next/router";
import Script from "next/script";
import PropTypes from "prop-types";
import { memo, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import { MemoizedSidebarLayout } from "./components/Sidebar";

/**
 * Custom function to render the `Layout` component
 *
 * @param {any} children
 */
export function Layout({ children }) {
	// Router
	const router = useRouter();

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);
	}, [router]);

	return <main tw="h-screen">{children}</main>;
}

Layout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `Layout` component
 */
export const MemoizedLayout = memo(Layout);

/**
 * Custom function to render the `DashboardLayout` component
 *
 * @param {any} children
 */
export function DashboardLayout({ children }) {
	// Custom hooks
	const {
		ref: dashboardLayoutRef,
		isComponentVisible: isDashboardLayoutComponentVisible,
		setIsComponentVisible: setIsDashboardLayoutComponentVisible
	} = useComponentVisible(false);

	return (
		<>
			<Script src="/scripts/beacon.js" strategy="lazyOnload" />
			<Script src="/scripts/usetiful.js" strategy="lazyOnload" />

			<main tw="h-screen">
				<section tw="h-screen overflow-hidden bg-white flex">
					<MemoizedSidebarLayout
						ref={dashboardLayoutRef}
						openSidebar={isDashboardLayoutComponentVisible}
						setOpenSidebar={setIsDashboardLayoutComponentVisible}
					/>

					<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
						<div tw="flex flex-shrink-0 border-b">
							<MemoizedAddSite
								handleOpenSidebar={() => setIsDashboardLayoutComponentVisible(!isDashboardLayoutComponentVisible)}
							/>
						</div>

						<div tw="flex-1">
							<Scrollbars universal>
								<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
									<div tw="flex flex-col h-full">{children}</div>
								</div>
							</Scrollbars>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

DashboardLayout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `DashboardLayout` component
 */
export const MemoizedDashboardLayout = memo(DashboardLayout);
