import { DashboardSitesLink, LoginLink } from "@constants/PageLinks";
// import AddSite from "@components/sites/AddSite";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useRouter } from "next/router";
import Script from "next/script";
import { memo, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import { MemoizedMobileSidebarLayout } from "./components/MobileSidebar";
import { MemoizedSidebarLayout } from "./components/Sidebar";
/**
 * Custom function to render the `Layout` component
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

/**
 * Memoized custom `Layout` component
 */
export const MemoizedLayout = memo(Layout);

/**
 * Custom function to render the `DashboardLayout` component
 */
export function DashboardLayout({ children }) {
	// Custom hooks
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	return (
		<>
			<Script src="/scripts/beacon.js" strategy="lazyOnload" />
			<Script src="/scripts/usetiful.js" strategy="lazyOnload" />

			<main tw="h-screen">
				<section tw="h-screen overflow-hidden bg-gray-50 flex">
					<MemoizedSidebarLayout ref={ref} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

					<div tw="flex flex-col w-0 flex-1 overflow-hidden min-h-screen">
						<div tw="relative flex-shrink-0 flex">
							<div tw="border-b flex-shrink-0 flex">
								<MemoizedMobileSidebarLayout openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
							</div>

							{/* <AddSite /> */}
						</div>

						<Scrollbars universal>
							<div tw="absolute w-full h-full max-w-screen-2xl mx-auto left-0 right-0">
								<div tw="flex flex-col h-full">{children}</div>
							</div>
						</Scrollbars>
					</div>
				</section>
			</main>
		</>
	);
}

/**
 * Memoized custom `DashboardLayout` component
 */
export const MemoizedDashboardLayout = memo(DashboardLayout);
