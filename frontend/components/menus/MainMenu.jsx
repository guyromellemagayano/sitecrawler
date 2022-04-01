import { DashboardSettingsSlug, DashboardSitesLink } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { MemoizedPrimaryMenu } from "./PrimaryMenu";
import { MemoizedSettingsMenu } from "./SettingsMenu";
import { MemoizedSiteMenu } from "./SiteMenu";

/**
 * Custom function to render the `MainMenu` component
 */
const MainMenu = () => {
	const [selectedMenu, setSelectedMenu] = useState(null);

	// Router
	const { asPath, query } = useRouter();

	// Custom variables
	const { siteId } = query;

	// Handle menu selection
	useEffect(() => {
		if (asPath.includes(DashboardSitesLink) && typeof siteId !== "undefined") {
			setSelectedMenu(<MemoizedSiteMenu />);
		} else if (asPath.includes(DashboardSettingsSlug)) {
			setSelectedMenu(<MemoizedSettingsMenu />);
		} else {
			setSelectedMenu(<MemoizedPrimaryMenu />);
		}
	}, [asPath, siteId]);

	return selectedMenu;
};

/**
 * Memoized custom `MainMenu` component
 */
export const MemoizedMainMenu = memo(MainMenu);
