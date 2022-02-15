import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteLinksPageLayout` component
 */
const SiteLinksPageLayout = () => {
	return <div tw="w-full flex items-start py-4"></div>;
};

/**
 * Memoized custom `SiteLinksPageLayout` component
 */
export const MemoizedSiteLinksPageLayout = memo(SiteLinksPageLayout);
