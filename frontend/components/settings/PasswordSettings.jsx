import { MemoizedPasswordSettingsForm } from "@components/forms/PasswordSettingsForm";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `PasswordSettings` component
 */
const PasswordSettings = () => {
	// Translations
	const { t } = useTranslation("settings");
	const passwordChangeUpdateTitle = t("passwordChangeUpdate.title");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return (
		<div tw="pb-12">
			<h5 tw="text-xl leading-6 font-bold text-gray-900">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					passwordChangeUpdateTitle
				) : (
					<Skeleton duration={2} width={175} height={24} />
				)}
			</h5>

			<MemoizedPasswordSettingsForm />
		</div>
	);
};

/**
 * Memoized custom `PasswordSettings` component
 */
export const MemoizedPasswordSettings = memo(PasswordSettings);
