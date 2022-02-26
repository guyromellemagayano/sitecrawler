import { MemoizedLargePageSizeSettings } from "@components/settings/LargePageSizeSettings";
import { MemoizedTimestampSettings } from "@components/settings/TimestampSettings";
import { memo } from "react";

/**
 * Custom function to render the `GlobaSettingsPageLayout` component
 */
const GlobaSettingsPageLayout = () => {
	return (
		<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
			<MemoizedTimestampSettings />
			<MemoizedLargePageSizeSettings />
		</div>
	);
};

/**
 * Memoized custom `GlobaSettingsPageLayout` component
 */
export const MemoizedGlobaSettingsPageLayout = memo(GlobaSettingsPageLayout);
