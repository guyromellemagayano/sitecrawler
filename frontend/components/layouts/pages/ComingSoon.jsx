import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ComingSoonPageLayout` component
 */
const ComingSoonPageLayout = () => {
	// Translations
	const { t } = useTranslation("common");
	const comingSoon = t("comingSoon");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	return (
		<div className="m-auto flex flex-grow items-center justify-center p-4">
			{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
				<h3 className="text-sm font-medium leading-6 text-gray-500">{comingSoon}</h3>
			) : (
				<Skeleton duration={2} width={196} height={16} />
			)}
		</div>
	);
};

/**
 * Memoized custom `ComingSoonPageLayout` component
 */
export const MemoizedComingSoonPageLayout = memo(ComingSoonPageLayout);
