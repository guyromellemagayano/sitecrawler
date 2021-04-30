// External
import "twin.macro";
import { MenuIcon } from "@heroicons/react/solid";

const MobileSidebarButton = ({ openMobileSidebar, setOpenMobileSidebar }) => {
	const openSidebarLabel = "Open sidebar";

	return (
		<button
			tw="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setOpenMobileSidebar(!openMobileSidebar)}
		>
			<span tw="sr-only">{openSidebarLabel}</span>
			<MenuIcon tw="h-6 w-6" />
		</button>
	);
};

export default MobileSidebarButton;
