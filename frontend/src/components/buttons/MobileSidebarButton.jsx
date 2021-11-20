import { MenuIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import useTranslation from "next-translate/useTranslation";
import * as React from "react";
import "twin.macro";

/**
 * Memoized function to render the `MobileSidebarButton` component.
 */
export const MobileSidebarButton = React.memo(() => {
	// React hook for managing the visibility of the component.
	const { isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	// Translations
	const { t } = useTranslation("common");
	const openSidebar = t("openSidebar");

	return (
		<button
			tw="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setIsComponentVisible(!isComponentVisible)}
		>
			<span tw="sr-only">{openSidebar}</span>
			<MenuIcon tw="h-6 w-6" />
		</button>
	);
});
