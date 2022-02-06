import { MemoizedAddSite } from "@components/sites/AddSite";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useUser } from "@hooks/useUser";
import { useRouter } from "next/router";
import Script from "next/script";
import PropTypes from "prop-types";
import { memo, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import { MemoizedSidebarLayout } from "./components/Sidebar";

/**
 * Custom function to render the `DashboardLayout` component
 *
 * @param {any} children
 */
export const DashboardLayout = ({ children }) => {
	// Custom hooks
	const {
		ref: dashboardLayoutRef,
		isComponentVisible: isDashboardLayoutComponentVisible,
		setIsComponentVisible: setIsDashboardLayoutComponentVisible
	} = useComponentVisible(false);

	return (
		<>
			<Script
				id="beacon-script"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
						!(function (e, t, n) {
							function a() {
								const e = t.getElementsByTagName("script")[0];
								const n = t.createElement("script");
								(n.type = "text/javascript"),
									(n.async = !0),
									(n.src = "https://beacon-v2.helpscout.net"),
									e.parentNode.insertBefore(n, e);
							}

							if (
								((e.Beacon = n =
									function (t, n, a) {
										e.Beacon.readyQueue.push({
											method: t,
											options: n,
											data: a
										});
									}),
								(n.readyQueue = []),
								t.readyState === "complete")
							)
								return a();
							e.attachEvent ? e.attachEvent("onload", a) : e.addEventListener("load", a, !1);
						})(window, document, window.Beacon || (() => {}));

						window.Beacon("init", "94d0425a-cb40-4582-909a-2175532bbfa9");
					`
				}}
			/>
			<Script
				id="usetiful-script"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `
						(function (w, d, s) {
							const a = d.getElementsByTagName("head")[0];
							const r = d.createElement("script");
							r.async = 1;
							r.src = s;
							r.setAttribute("id", "usetifulScript");
							r.dataset.token = "4b8863eaef435adc652a9d86eb33cbf9";
							a.appendChild(r);
						})(window, document, "https://www.usetiful.com/dist/usetiful.js");`
				}}
			/>

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
};

DashboardLayout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `DashboardLayout` component
 */
export const MemoizedDashboardLayout = memo(DashboardLayout);

/**
 * Custom function to render the `StaticLayout` component
 *
 * @param {any} children
 */
export const StaticLayout = ({ children }) => {
	// Router
	const router = useRouter();

	// SWR hooks
	const { user, validatingUser, errorUser } = useUser();

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);
	}, [router]);

	return <main tw="h-screen">{children}</main>;
};

StaticLayout.propTypes = {
	children: PropTypes.any
};

/**
 * Memoized custom `StaticLayout` component
 */
export const MemoizedStaticLayout = memo(StaticLayout);

/**
 * Custom function to render the `Layout` component
 *
 * @param {any} children
 */
export const Layout = ({ children }) => {
	// Router
	const router = useRouter();

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);
	}, [router]);

	return router.asPath.includes(DashboardSlug) ? (
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
