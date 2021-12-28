import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteOverviewPageLayout` component
 */
export function SiteOverviewPageLayout() {
	return <div tw="w-full flex items-start py-4"></div>;
}

/**
 * Memoized custom `SiteOverviewPageLayout` component
 */
export const MemoizedSiteOverviewPageLayout = memo(SiteOverviewPageLayout);
