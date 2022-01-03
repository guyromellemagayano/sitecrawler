import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteImagesPageLayout` component
 */
export function SiteImagesPageLayout() {
	return <div tw="w-full flex items-start py-4"></div>;
}

/**
 * Memoized custom `SiteImagesPageLayout` component
 */
export const MemoizedSiteImagesPageLayout = memo(SiteImagesPageLayout);
