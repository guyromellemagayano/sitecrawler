import { memo } from "react";

/**
 * Custom function to render the `SiteOverviewPageLayout` component
 */
const SiteOverviewPageLayout = () => {
	return <div className="flex w-full items-start py-4"></div>;
};

/**
 * Memoized custom `SiteOverviewPageLayout` component
 */
export const MemoizedSiteOverviewPageLayout = memo(SiteOverviewPageLayout);
