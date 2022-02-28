// import { MemoizedLargePageSizeSettingsForm } from "@components/forms/LargePageSizeSettingsForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `LargePageSizeSettings` component
 */
const LargePageSizeSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const largePageSizeSettings = t("profileInformationUpdate.title");

	// Custom hooks
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<div className="pb-12">
			<h5 className="text-xl font-bold leading-6 text-gray-900">
				{isComponentReady ? largePageSizeSettings : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			{/* <MemoizedLargePageSizeSettingsForm /> */}
		</div>
	);
};

/**
 * Memoized custom `LargePageSizeSettings` component
 */
export const MemoizedLargePageSizeSettings = memo(LargePageSizeSettings);
