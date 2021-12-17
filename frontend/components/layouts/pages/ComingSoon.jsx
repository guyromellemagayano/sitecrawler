import { useLoading } from "@hooks/useLoading";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `ComingSoonPageLayout` component
 */
export function ComingSoonPageLayout() {
	// Translations
	const { t } = useTranslation("common");
	const comingSoon = t("comingSoon");

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// Custom hooks
	const { isComponentReady } = useLoading();

	return (
		<div tw="flex-grow flex justify-center items-center p-4 m-auto">
			{isComponentReady && !validatingUser && !errorUser && typeof user !== "undefined" && user !== null ? (
				<h4 tw="text-lg leading-6 font-medium text-gray-500">{comingSoon}</h4>
			) : (
				<Skeleton duration={2} width={196} height={16} />
			)}
		</div>
	);
}

/**
 * Memoized custom `ComingSoonPageLayout` component
 */
export const MemoizedComingSoonPageLayout = memo(ComingSoonPageLayout);
