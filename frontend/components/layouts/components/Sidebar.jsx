// import MainMenu from "@components/menus/MainMenu";
import ProfileMenu from "@components/menus/ProfileMenu";
import { forwardRef, memo } from "react";
import "twin.macro";
import MobileSidebar from "./MobileSidebar";

/**
 * Memoized function to render the `Sidebar` component.
 */
const Sidebar = memo(
	forwardRef(({ openSidebar, setOpenSidebar }, ref) => {
		return (
			<>
				<MobileSidebar ref={ref} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

				<aside tw="bg-gray-1000 hidden lg:flex lg:flex-shrink-0">
					<div tw="flex flex-col w-64">
						<div tw="h-0 flex-1 overflow-y-auto">{/* <MainMenu /> */}</div>

						<ProfileMenu />
					</div>
				</aside>
			</>
		);
	})
);

export default Sidebar;
