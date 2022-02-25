import { MemoizedPersonalSettingsForm } from "@components/forms/PersonalSettingsForm";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `PersonalSettings` component
 */
const PersonalSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const profileInformationUpdateTitle = t("profileInformationUpdate.title");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return (
		<div className="pb-12">
			<h5 className="text-xl font-bold leading-6 text-gray-900">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					profileInformationUpdateTitle
				) : (
					<Skeleton duration={2} width={175} height={24} />
				)}
			</h5>

			<MemoizedPersonalSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `PersonalSettings` component
 */
export const MemoizedPersonalSettings = memo(PersonalSettings);
