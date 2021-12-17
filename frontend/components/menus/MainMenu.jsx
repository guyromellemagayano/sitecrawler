import { DashboardSettingsSlug, DashboardSiteSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { MemoizedPrimaryMenu } from "./PrimaryMenu";
import { MemoizedSettingsMenu } from "./SettingsMenu";
import { MemoizedSiteMenu } from "./SiteMenu";

/**
 * Custom function to render the `MainMenu` component
 */
export function MainMenu() {
	const [selectedMenu, setSelectedMenu] = useState(<MemoizedPrimaryMenu />);

	// Router
	const { asPath } = useRouter();

	// Handle menu selection
	const handleMenuSelection = useCallback(async () => {
		if (asPath.includes(DashboardSiteSlug)) {
			setSelectedMenu(<MemoizedSiteMenu />);
		} else if (asPath.includes(DashboardSettingsSlug)) {
			setSelectedMenu(<MemoizedSettingsMenu />);
		} else {
			setSelectedMenu(<MemoizedPrimaryMenu />);
		}
	}, [asPath]);

	useEffect(() => {
		handleMenuSelection();
	}, [handleMenuSelection]);

	return selectedMenu;
}

/**
 * Memoized custom `MainMenu` component
 */
export const MemoizedMainMenu = memo(MainMenu);
