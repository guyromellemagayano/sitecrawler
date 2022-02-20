import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { ExclamationIcon } from "@heroicons/react/outline";
import { ViewBoardsIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo } from "react";
import "twin.macro";

const EmptyState = () => {
	// Translations
	const { t } = useTranslation("common");
	const siteFeatureNotAvailableTitle = t("siteFeatureNotAvailableTitle");
	const siteFeatureNotAvailableMessage = t("siteFeatureNotAvailableMessage");
	const upgradePlanText = t("upgradePlan");

	return (
		<div tw="text-center">
			<ExclamationIcon tw="mx-auto h-12 w-12 text-yellow-400" />
			<h3 tw="mt-2 text-sm font-medium text-gray-900">{siteFeatureNotAvailableTitle}</h3>
			<p tw="mt-1 text-sm text-gray-500">{siteFeatureNotAvailableMessage}</p>
			<div tw="mt-6">
				<Link href={SubscriptionPlansSettingsLink} passHref>
					<a
						type="button"
						tw="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
					>
						<ViewBoardsIcon tw="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						{upgradePlanText}
					</a>
				</Link>
			</div>
		</div>
	);
};

export const MemoizedEmptyState = memo(EmptyState);
