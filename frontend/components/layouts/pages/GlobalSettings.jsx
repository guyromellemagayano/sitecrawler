import { MemoizedLargePageSizeSettings } from "@components/settings/LargePageSizeSettings";
import { MemoizedTimestampSettings } from "@components/settings/TimestampSettings";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `GlobaSettingsPageLayout` component
 */
const GlobaSettingsPageLayout = () => {
	return (
		<div tw="py-4 grid grid-cols-1 w-full xl:max-w-md gap-6">
			<MemoizedTimestampSettings />
			<MemoizedLargePageSizeSettings />
		</div>
	);
};

/**
 * Memoized custom `GlobaSettingsPageLayout` component
 */
export const MemoizedGlobaSettingsPageLayout = memo(GlobaSettingsPageLayout);
