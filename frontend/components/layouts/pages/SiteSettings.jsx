import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDeleteSiteSettings } from "@components/settings/DeleteSiteSettings";
import { MemoizedSiteInformationSettings } from "@components/settings/SiteInformationSettings";
import { memo } from "react";

/**
 * Custom function to render the `SiteSettingsPageLayout` component
 */
const SiteSettingsPageLayout = () => {
	return (
		<>
			<MemoizedPageOption isSiteSettings />
			<div className="grid w-full grid-cols-1 gap-6 py-4 xl:max-w-md">
				<MemoizedSiteInformationSettings />
				<MemoizedDeleteSiteSettings />
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteSettingsPageLayout` component
 */
export const MemoizedSiteSettingsPageLayout = memo(SiteSettingsPageLayout);
