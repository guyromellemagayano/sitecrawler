import { SettingsSlug, SitesSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import { MemoizedPrimaryMenu } from "./PrimaryMenu";
import { MemoizedSettingsMenu } from "./SettingsMenu";
import { MemoizedSiteMenu } from "./SiteMenu";

/**
 * Custom function to render the `MainMenu` component
 */
export function MainMenu() {
	const [selectedMenu, setSelectedMenu] = useState(<MemoizedPrimaryMenu />);

	// Router
	const { pathname } = useRouter();

	useEffect(() => {
		if (pathname.includes(SitesSlug)) {
			setSelectedMenu(<MemoizedSiteMenu />);
		} else if (pathname.includes(SettingsSlug)) {
			setSelectedMenu(<MemoizedSettingsMenu />);
		} else {
			setSelectedMenu(<MemoizedPrimaryMenu />);
		}
	}, [pathname]);

	return selectedMenu;
}

/**
 * Memoized custom `MainMenu` component
 */
export const MemoizedMainMenu = memo(MainMenu);
