import { AddNewSiteLink, DashboardSitesLink, SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationIcon } from "@heroicons/react/outline";
import { PlusIcon, ViewBoardsIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";
import tw from "twin.macro";

const EmptyState = () => {
	// Translations
	const { t } = useTranslation();
	const siteFeatureNotAvailableTitleText = t("common:siteFeatureNotAvailableTitle");
	const siteFeatureNotAvailableMessageText = t("common:siteFeatureNotAvailableMessage");
	const upgradePlanText = t("common:upgradePlan");
	const noAvailableSitesText = t("sites:noAvailableSites");
	const addNewSiteMessageText = t("sites:addNewSiteMessage");
	const addNewSiteText = t("sites:addNewSite");

	// Router
	const { asPath, push } = useRouter();

	// Handle `onClick` event on <Link> element
	const handleRouterOnClick = (e) => {
		e.preventDefault();

		if (asPath !== DashboardSitesLink) {
			push(SubscriptionPlansSettingsLink);
		} else {
			push(AddNewSiteLink + "?step=1&edit=false&verified=false");
		}
	};

	return (
		<div tw="text-center">
			{asPath !== DashboardSitesLink ? (
				<ExclamationIcon tw="mx-auto h-12 w-12 text-yellow-400" />
			) : (
				<FontAwesomeIcon icon={["far", "folder-plus"]} tw="mx-auto h-12 w-12 text-gray-400" />
			)}

			<h3 tw="mt-2 text-sm font-medium text-gray-900">
				{asPath !== DashboardSitesLink ? siteFeatureNotAvailableTitleText : noAvailableSitesText}
			</h3>
			<p tw="mt-1 text-sm text-gray-500">
				{asPath !== DashboardSitesLink ? siteFeatureNotAvailableMessageText : addNewSiteMessageText}
			</p>
			<div tw="mt-6">
				<Link href="/" passHref>
					<a
						role="button"
						tabIndex="0"
						onClick={handleRouterOnClick}
						aria-hidden="true"
						css={[
							tw`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2`,
							asPath !== DashboardSitesLink
								? tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500`
								: tw`bg-green-600 hover:bg-green-700 focus:ring-green-500`
						]}
					>
						{asPath !== DashboardSitesLink ? (
							<ViewBoardsIcon tw="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						) : (
							<PlusIcon tw="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
						)}
						{asPath !== DashboardSitesLink ? upgradePlanText : addNewSiteText}
					</a>
				</Link>
			</div>
		</div>
	);
};

export const MemoizedEmptyState = memo(EmptyState);
