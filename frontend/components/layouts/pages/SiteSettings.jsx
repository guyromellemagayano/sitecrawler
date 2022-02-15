import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteSettingsPageLayout` component
 */
const SiteSettingsPageLayout = () => {
	return <div tw="w-full flex items-start py-4"></div>;
};

/**
 * Memoized custom `SiteSettingsPageLayout` component
 */
export const MemoizedSiteSettingsPageLayout = memo(SiteSettingsPageLayout);
