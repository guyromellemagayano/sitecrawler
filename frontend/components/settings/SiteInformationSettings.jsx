import { MemoizedSiteInformationSettingsForm } from "@components/forms/SiteInformationSettingsForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteInformationSettings` component
 */
const SiteInformationSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const siteInformationSettingsTitleText = t("siteInformationSettings.title");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<div className="pb-12">
			<h5 className="text-xl font-bold leading-6 text-gray-900">
				{isComponentReady ? siteInformationSettingsTitleText : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<MemoizedSiteInformationSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `SiteInformationSettings` component
 */
export const MemoizedSiteInformationSettings = memo(SiteInformationSettings);
