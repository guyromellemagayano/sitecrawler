// import { MemoizedLargePageSizeSettingsForm } from "@components/forms/LargePageSizeSettingsForm";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `LargePageSizeSettings` component
 */
const LargePageSizeSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const largePageSizeSettings = t("profileInformationUpdate.title");

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
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
