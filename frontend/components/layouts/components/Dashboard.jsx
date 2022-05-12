/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedNotification } from "@components/notifications";
import { MemoizedAddSite } from "@components/sites/AddSite";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
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
			{state?.responses?.length > 0 && state?.isNotification ? (
				<div
					aria-live="assertive"
					className={classnames(
						"right-5 top-5 bottom-5 z-50 flex w-full max-w-xs flex-col items-end justify-end gap-4 overflow-y-auto",
						state?.responses?.length > 0 && state?.isNotification ? "fixed" : "hidden"
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

			<main className="flex h-screen w-full overflow-hidden bg-white">
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

					<div className="flex-1 bg-white">
						<Scrollbars autoHide universal>
							<div className="absolute left-0 right-0 mx-auto h-full w-full max-w-screen-2xl">
								<div className="flex h-full flex-col">{children}</div>
							</div>
						</Scrollbars>
					</div>
				</div>
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
