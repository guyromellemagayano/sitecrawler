import { MenuIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import "twin.macro";

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
			tw="flex-shrink-0 flex items-center px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={handleOpenSidebar}
		>
			<div tw="flex-1">
				<span tw="sr-only">{openSidebarText}</span>
				<MenuIcon tw="h-6 w-6" />
			</div>
		</button>
	);
};

/**
 * Memoized custom `MobileSidebarButton` component
 */
export const MemoizedMobileSidebarButton = memo(MobileSidebarButton);
