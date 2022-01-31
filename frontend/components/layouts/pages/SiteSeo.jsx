import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `SiteSeoPageLayout` component
 */
const SiteSeoPageLayout = () => {
	return <div tw="w-full flex items-start py-4"></div>;
};

/**
 * Memoized custom `SiteSeoPageLayout` component
 */
export const MemoizedSiteSeoPageLayout = memo(SiteSeoPageLayout);
