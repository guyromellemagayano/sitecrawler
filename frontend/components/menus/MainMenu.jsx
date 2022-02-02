import { DashboardSettingsSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { MemoizedPrimaryMenu } from "./PrimaryMenu";
import { MemoizedSettingsMenu } from "./SettingsMenu";
// import { MemoizedSiteMenu } from "./SiteMenu";

/**
 * Custom function to render the `MainMenu` component
 */
const MainMenu = () => {
	const [selectedMenu, setSelectedMenu] = useState(null);

	// Router
	const { asPath } = useRouter();

	// Handle menu selection
	useEffect(() => {
		// if (asPath.includes(DashboardSiteSlug)) {
		// 	setSelectedMenu(<MemoizedSiteMenu />);
		// } else if (asPath.includes(DashboardSettingsSlug)) {
		// 	setSelectedMenu(<MemoizedSettingsMenu />);
		// } else {
		// 	setSelectedMenu(<MemoizedPrimaryMenu />);
		// }

		if (asPath.includes(DashboardSettingsSlug)) {
			setSelectedMenu(<MemoizedSettingsMenu />);
		} else {
			setSelectedMenu(<MemoizedPrimaryMenu />);
		}
	}, [asPath]);

	return selectedMenu;
};

/**
 * Memoized custom `MainMenu` component
 */
export const MemoizedMainMenu = memo(MainMenu);
