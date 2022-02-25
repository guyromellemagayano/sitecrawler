import { MemoizedMainMenu } from "@components/menus/MainMenu";
import { MemoizedProfileMenu } from "@components/menus/ProfileMenu";
import { forwardRef, memo } from "react";
import { MemoizedMobileSidebarLayout } from "./MobileSidebar";

/**
 * Custom function to render the `Sidebar` component
 *
 * @param {boolean} openSidebar
 * @param {function} setOpenSidebar
 */
const SidebarLayout = ({ openSidebar = false, setOpenSidebar }, ref) => {
	return (
		<>
			<MemoizedMobileSidebarLayout ref={ref} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

			<aside className="hidden bg-gray-1000 lg:flex lg:flex-shrink-0">
				<div className="flex w-64 flex-col">
					<div className="h-0 flex-1 overflow-y-auto">
						<MemoizedMainMenu />
					</div>
					<MemoizedProfileMenu />
				</div>
			</aside>
		</>
	);
};

/**
 * Memoized custom `SidebarLayout` component
 */
const ForwardRefSidebarLayout = forwardRef(SidebarLayout);
export const MemoizedSidebarLayout = memo(ForwardRefSidebarLayout);
