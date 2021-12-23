// import { MemoizedDeleteUserAccountSettings } from "@components/settings/DeleteUserAccountSettings";
import { MemoizedPasswordSettings } from "@components/settings/PasswordSettings";
import { MemoizedPersonalSettings } from "@components/settings/PersonalSettings";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `ProfileSettingsPageLayout` component
 */
export function ProfileSettingsPageLayout() {
	return (
		<div tw="py-4 grid grid-cols-1 w-full xl:max-w-md gap-6">
			<MemoizedPersonalSettings />
			<MemoizedPasswordSettings />
			{/* <MemoizedDeleteUserAccountSettings /> */}
		</div>
	);
}

/**
 * Memoized custom `ProfileSettingsPageLayout` component
 */
export const MemoizedProfileSettingsPageLayout = memo(ProfileSettingsPageLayout);
