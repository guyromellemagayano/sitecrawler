import { MenuIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `MobileSidebarButton` component
 *
 * @param {boolean} isComponentVisible
 * @param {function} setIsComponentVisible
 */
export function MobileSidebarButton({ isComponentVisible, setIsComponentVisible }) {
	// Translations
	const { t } = useTranslation("common");
	const openSidebarText = t("openSidebar");

	return (
		<button
			tw="flex-shrink-0 flex px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setIsComponentVisible(!isComponentVisible)}
		>
			<span tw="sr-only">{openSidebarText}</span>
			<MenuIcon tw="h-6 w-6" />
		</button>
	);
}

export const MemoizedMobileSidebarButton = memo(MobileSidebarButton);
