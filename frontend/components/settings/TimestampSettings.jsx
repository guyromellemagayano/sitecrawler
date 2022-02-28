import { MemoizedTimestampSettingsForm } from "@components/forms/TimestampSettingsForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `TimestampSettings` component
 */
const TimestampSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const timestampSettingsTitle = t("timestampSettings.title");

	// Custom hooks
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<div className="pb-12">
			<h5 className="text-xl font-bold leading-6 text-gray-900">
				{isComponentReady ? timestampSettingsTitle : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<MemoizedTimestampSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `TimestampSettings` component
 */
export const MemoizedTimestampSettings = memo(TimestampSettings);
