import { MenuIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";

/**
 * Custom function to render the `MobileSidebarButton` component
 *
 * @param {boolean} openSidebar
 * @param {function} setOpenSidebar
 */
const MobileSidebarButton = ({ handleOpenSidebar }) => {
	// Translations
	const { t } = useTranslation("common");
	const openSidebarText = t("openSidebar");

	return (
		<button
			className="flex flex-shrink-0 items-center border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={handleOpenSidebar}
		>
			<div className="flex-1">
				<span className="sr-only">{openSidebarText}</span>
				<MenuIcon className="h-6 w-6" />
			</div>
		</button>
	);
};

/**
 * Memoized custom `MobileSidebarButton` component
 */
export const MemoizedMobileSidebarButton = memo(MobileSidebarButton);
