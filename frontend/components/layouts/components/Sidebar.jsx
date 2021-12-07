import { MemoizedMainMenu } from "@components/menus/MainMenu";
import { MemoizedProfileMenu } from "@components/menus/ProfileMenu";
import { forwardRef, memo } from "react";
import "twin.macro";
import { MemoizedMobileSidebarLayout } from "./MobileSidebar";

/**
 * Custom function to render the `Sidebar` component
 */
export function SidebarLayout({ openSidebar = false, setOpenSidebar }, ref) {
	return (
		<>
			<MemoizedMobileSidebarLayout ref={ref} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

			<aside tw="bg-gray-1000 hidden lg:flex lg:flex-shrink-0">
				<div tw="flex flex-col w-64">
					<div tw="h-0 flex-1 overflow-y-auto">
						<MemoizedMainMenu />
					</div>

					<MemoizedProfileMenu />
				</div>
			</aside>
		</>
	);
}

/**
 * Memoized custom `SidebarLayout` component
 */
export const ForwardRefSidebarLayout = forwardRef(SidebarLayout);
export const MemoizedSidebarLayout = memo(ForwardRefSidebarLayout);
