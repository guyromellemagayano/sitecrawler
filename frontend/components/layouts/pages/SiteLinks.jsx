import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteLinksPageLayout` component
 */
export function SiteLinksPageLayout() {
	return <div tw="w-full flex items-start py-4"></div>;
}

/**
 * Memoized custom `SiteLinksPageLayout` component
 */
export const MemoizedSiteLinksPageLayout = memo(SiteLinksPageLayout);
