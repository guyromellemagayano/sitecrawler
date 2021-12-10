import { MemoizedHelpSupportSettingsForm } from "@components/forms/HelpSupportForm";
import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `HelpSupportSettings` component
 */
export function HelpSupportSettings() {
	// Translations
	const { t } = useTranslation("settings");
	const helpSupportFormTitle = t("helpSupportFormTitle");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
				{isComponentReady && !validatingUser && !errorUser && typeof user !== "undefined" && user !== null ? (
					helpSupportFormTitle
				) : (
					<Skeleton duration={2} width={175} height={24} />
				)}
			</h5>

			<MemoizedHelpSupportSettingsForm />
		</div>
	);
}

/**
 * Memoized custom `HelpSupportSettings` component
 */
export const MemoizedHelpSupportSettings = memo(HelpSupportSettings);
