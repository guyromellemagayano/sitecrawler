import { MenuIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Memoized function to render the `MobileSidebarButton` component.
 */
const MobileSidebarButton = memo(({ openSidebar, setOpenSidebar }) => {
	// Translations
	const { t } = useTranslation("common");
	const openSidebarText = t("openSidebar");

	return (
		<button
			tw="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setOpenSidebar(!openSidebar)}
		>
			<span tw="sr-only">{openSidebarText}</span>
			<MenuIcon tw="h-6 w-6" />
		</button>
	);
});

MobileSidebarButton.propTypes = {
	openSidebar: PropTypes.bool,
	setOpenSidebar: PropTypes.func
};

export default MobileSidebarButton;
