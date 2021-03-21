// External
import loadable from "@loadable/component";
import tw from "twin.macro";

// Components
const MenuSvg = loadable(() => import("src/components/svg/MenuSvg"));

const MobileSidebarButton = ({ openMobileSidebar, setOpenMobileSidebar }) => {
	const openSidebarLabel = "Open sidebar";

	return (
		<button
			tw="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setOpenMobileSidebar(!openMobileSidebar)}
		>
			<span tw="sr-only">{openSidebarLabel}</span>
			<MenuSvg className={tw`h-6 w-6`} />
		</button>
	);
};

export default MobileSidebarButton;
