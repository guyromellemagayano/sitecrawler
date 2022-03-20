import { MemoizedHelpSupportSettingsForm } from "@components/forms/HelpSupportSettingsForm";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `HelpSupportSettings` component
 */
const HelpSupportSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const helpSupportFormTitle = t("helpSupportForm.title");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	return (
		<div className="pb-12">
			<h5 className="text-xl font-bold leading-6 text-gray-900">
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
