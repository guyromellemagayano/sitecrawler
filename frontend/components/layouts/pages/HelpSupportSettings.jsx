import { MemoizedHelpSupportSettings } from "@components/settings/HelpSupportSettings";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `HelpSupportSettingsPageLayout` component
 */
const HelpSupportSettingsPageLayout = () => {
	return (
		<div tw="py-4 grid grid-cols-1 w-full xl:max-w-md gap-6">
			<MemoizedHelpSupportSettings />
		</div>
	);
};

/**
 * Memoized custom `HelpSupportSettingsPageLayout` component
 */
export const MemoizedHelpSupportSettingsPageLayout = memo(HelpSupportSettingsPageLayout);
