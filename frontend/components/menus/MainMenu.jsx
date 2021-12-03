import { SettingsSlug, SitesSlug } from "@constants/PageLinks";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import PrimaryMenu from "./PrimaryMenu";
import SettingsMenu from "./SettingsMenu";
import SiteMenu from "./SiteMenu";

/**
 * Memoized function to render the `MainMenu` component.
 */
const MainMenu = memo(() => {
	const [selectedMenu, setSelectedMenu] = useState(null);

	// Router
	const { pathname } = useRouter();

	useEffect(() => {
		if (pathname.includes(SitesSlug)) {
			setSelectedMenu(<SiteMenu />);
		} else if (pathname.includes(SettingsSlug)) {
			setSelectedMenu(<SettingsMenu />);
		} else {
			setSelectedMenu(<PrimaryMenu />);
		}
	}, [pathname]);

	return selectedMenu;
});

export default MainMenu;
