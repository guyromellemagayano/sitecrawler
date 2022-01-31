import { MemoizedHelpSupportSettingsForm } from "@components/forms/HelpSupportSettingsForm";
import { useLoading } from "@hooks/useLoading";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `HelpSupportSettings` component
 */
const HelpSupportSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const helpSupportFormTitle = t("helpSupportForm.title");

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
				{isComponentReady ? helpSupportFormTitle : <Skeleton duration={2} width={175} height={24} />}
			</h5>

			<MemoizedHelpSupportSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `HelpSupportSettings` component
 */
export const MemoizedHelpSupportSettings = memo(HelpSupportSettings);
