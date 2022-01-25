import { MemoizedPersonalSettingsForm } from "@components/forms/PersonalSettingsForm";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `PersonalSettings` component
 */
const PersonalSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const profileInformationUpdateTitle = t("profileInformationUpdate.title");

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
				{isComponentReady ? profileInformationUpdateTitle : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<MemoizedPersonalSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `PersonalSettings` component
 */
export const MemoizedPersonalSettings = memo(PersonalSettings);
