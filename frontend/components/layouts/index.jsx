import { MemoizedAlert } from "@components/alerts";
import { MemoizedNotification } from "@components/notifications";
import { MemoizedAddSite } from "@components/sites/AddSite";
import { DashboardSitesLink, DashboardSlug } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { MemoizedSidebarLayout } from "./components/Sidebar";

/**
 * Custom function to render the `DashboardLayout` component
 *
 * @param {any} children
 */
export const DashboardLayout = ({ children }) => {
	// Custom context
	const { state } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const {
		ref: dashboardLayoutRef,
		isComponentVisible: isDashboardLayoutComponentVisible,
		setIsComponentVisible: setIsDashboardLayoutComponentVisible
	} = useComponentVisible(false);

	return (
		<>
			{state?.responses?.length > 0 ? (
				<div
					aria-live="assertive"
					className={classnames(
						"right-3 top-3 bottom-3 z-50 flex w-full max-w-xs flex-col items-end justify-end gap-4 overflow-y-auto",
						state?.responses?.length > 0 ? "fixed" : "hidden"
					)}
				>
					<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
						{state.responses.map((value, key) => {
							// Notification Messsages
							const responseTitle = value.responseTitle ?? null;
							const responseText = value.responseText ?? null;
							const isSuccess = value.isSuccess ?? null;

							return (
								<MemoizedNotification
									key={key}
									responseTitle={responseTitle}
									responseText={responseText}
									isSuccess={isSuccess}
								/>
							);
						}) ?? null}
					</div>
				</div>
			) : null}

			<main className="h-screen w-full">
				<section className="flex h-full overflow-hidden bg-white">
					<MemoizedSidebarLayout
						ref={dashboardLayoutRef}
						openSidebar={isDashboardLayoutComponentVisible}
						setOpenSidebar={setIsDashboardLayoutComponentVisible}
					/>

					<div className="flex min-h-full w-0 flex-1 flex-col overflow-hidden">
						<div className="flex flex-shrink-0 border-b">
							<MemoizedAddSite
								handleOpenSidebar={() => setIsDashboardLayoutComponentVisible(!isDashboardLayoutComponentVisible)}
							/>
						</div>

						<div className="flex-1">
							<Scrollbars autoHide universal>
								<div className="absolute left-0 right-0 mx-auto h-full w-full max-w-screen-2xl">
									<div className="flex h-full flex-col">{children}</div>
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
		<>
			{state?.responses?.length > 0 ? (
				<div
					aria-live="assertive"
					className={classnames(
						"right-3 top-3 bottom-3 z-50 flex w-full max-w-xs flex-col items-end justify-start gap-4 overflow-y-auto",
						state?.responses?.length > 0 ? "fixed" : "hidden"
					)}
				>
					<div className="flex w-full flex-col items-center space-y-4 sm:items-end">
						{state?.responses?.length > 0
							? state.responses.map((value, key) => {
									// Alert Messsages
									const responseText = value.responseText ?? null;
									const isSuccess = value.isSuccess ?? null;

									return <MemoizedAlert key={key} responseText={responseText} isSuccess={isSuccess} />;
							  }) ?? null
							: null}
					</div>
				</div>
			) : null}

			<main className="h-screen w-full">{children}</main>
		</>
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
