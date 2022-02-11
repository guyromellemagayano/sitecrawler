import { MemoizedAlert } from "@components/alerts";
import { MemoizedNotification } from "@components/notifications";
import { MemoizedAddSite } from "@components/sites/AddSite";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { useRouter } from "next/router";
import Script from "next/script";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import "twin.macro";
import { MemoizedSidebarLayout } from "./components/Sidebar";

/**
 * Custom function to render the `DashboardLayout` component
 *
 * @param {any} children
 */
export const DashboardLayout = ({ children }) => {
	// Router
	const { prefetch } = useRouter();

	// Custom context
	const { state } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: dashboardLayoutRef,
		isComponentVisible: isDashboardLayoutComponentVisible,
		setIsComponentVisible: setIsDashboardLayoutComponentVisible
	} = useComponentVisible(false);

	useEffect(() => {
		// Prefetch sites page for faster loading
		prefetch(LoginLink);
	}, []);

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

			{state?.responses?.map((value, key) => {
				// Alert Messsages
				const responseTitle = value.responseTitle ?? null;
				const responseText = value.responseText ?? null;
				const isSuccess = value.isSuccess ?? null;

				return (
					<div
						key={key}
						aria-live="assertive"
						tw="fixed z-30 w-full max-w-md right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto"
					>
						<MemoizedNotification
							key={key}
							responseTitle={responseTitle}
							responseText={responseText}
							isSuccess={isSuccess}
						/>
					</div>
				);
			}) ?? null}

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
	const { prefetch } = useRouter();

	// Custom context
	const { state } = useContext(SiteCrawlerAppContext);

	useEffect(() => {
		// Prefetch sites page for faster loading
		prefetch(DashboardSitesLink);
	}, []);

	return (
		<main tw="h-screen">
			{state?.responses?.map((value, key) => {
				// Alert Messsages
				const responseText = value.responseText ?? null;
				const isSuccess = value.isSuccess ?? null;

				return (
					<div
						key={key}
						aria-live="assertive"
						tw="fixed z-30 w-full max-w-md right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto"
					>
						<MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />
					</div>
				);
			}) ?? null}
			{children}
		</main>
	);
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
