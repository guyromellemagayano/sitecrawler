import { memo } from "react";

/**
 * Custom function to render the `SiteSettingsPageLayout` component
 */
const SiteSettingsPageLayout = () => {
	return <div className="flex w-full items-start py-4"></div>;
};

/**
 * Memoized custom `SiteSettingsPageLayout` component
 */
export const MemoizedSiteSettingsPageLayout = memo(SiteSettingsPageLayout);
