import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteOverviewPageLayout` component
 */
const SiteOverviewPageLayout = () => {
	return <div tw="w-full flex items-start py-4"></div>;
};

/**
 * Memoized custom `SiteOverviewPageLayout` component
 */
export const MemoizedSiteOverviewPageLayout = memo(SiteOverviewPageLayout);
