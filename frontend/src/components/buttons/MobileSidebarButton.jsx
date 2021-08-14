// React
import * as React from "react";

// External
import "twin.macro";
import { MenuIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

const MobileSidebarButton = ({ openSidebar, setOpenSidebar }) => {
	const openSidebarLabel = "Open sidebar";

	return (
		<button
			tw="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 lg:hidden"
			onClick={() => setOpenSidebar(!openSidebar)}
		>
			<span tw="sr-only">{openSidebarLabel}</span>
			<MenuIcon tw="h-6 w-6" />
		</button>
	);
};

MobileSidebarButton.propTypes = {
	openSidebar: PropTypes.bool,
	setOpenSidebar: PropTypes.func
};

MobileSidebarButton.defaultProps = {
	openSidebar: false,
	setOpenSidebar: null
};

export default MobileSidebarButton;
