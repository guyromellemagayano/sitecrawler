import { DashboardSettingsSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
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
	const handleMenuSelection = useCallback(async () => {
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

		return () => {
			setSelectedMenu(null);
		};
	}, [asPath]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleMenuSelection();
		}

		return () => {
			isMounted = false;
		};
	}, [handleMenuSelection]);

	return selectedMenu;
};

/**
 * Memoized custom `MainMenu` component
 */
export const MemoizedMainMenu = memo(MainMenu);
