import { MemoizedTimestampSettingsForm } from "@components/forms/TimestampSettingsForm";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `TimestampSettings` component
 */
const TimestampSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const timestampSettingsTitle = t("timestampSettings.title");

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
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