import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SitePagesPageLayout` component
 */
const SitePagesPageLayout = () => {
	return <div tw="w-full flex items-start py-4"></div>;
};

/**
 * Memoized custom `SitePagesPageLayout` component
 */
export const MemoizedSitePagesPageLayout = memo(SitePagesPageLayout);
