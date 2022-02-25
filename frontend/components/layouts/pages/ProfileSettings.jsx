import { MemoizedDeleteUserAccountSettings } from "@components/settings/DeleteUserAccountSettings";
import { MemoizedPasswordSettings } from "@components/settings/PasswordSettings";
import { MemoizedPersonalSettings } from "@components/settings/PersonalSettings";
import { memo } from "react";

/**
 * Custom function to render the `ProfileSettingsPageLayout` component
 */
const ProfileSettingsPageLayout = () => {
	return (
		<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
			<MemoizedPersonalSettings />
			<MemoizedPasswordSettings />
			<MemoizedDeleteUserAccountSettings />
		</div>
	);
};

/**
 * Memoized custom `ProfileSettingsPageLayout` component
 */
export const MemoizedProfileSettingsPageLayout = memo(ProfileSettingsPageLayout);
