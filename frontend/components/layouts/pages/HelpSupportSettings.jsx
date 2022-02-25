import { MemoizedHelpSupportSettings } from "@components/settings/HelpSupportSettings";
import { memo } from "react";

/**
 * Custom function to render the `HelpSupportSettingsPageLayout` component
 */
const HelpSupportSettingsPageLayout = () => {
	return (
		<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
			<MemoizedHelpSupportSettings />
		</div>
	);
};

/**
 * Memoized custom `HelpSupportSettingsPageLayout` component
 */
export const MemoizedHelpSupportSettingsPageLayout = memo(HelpSupportSettingsPageLayout);
