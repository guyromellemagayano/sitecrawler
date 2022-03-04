import { ResetLoadingStateTimeout } from "@constants/GlobalValues";
import { AddNewSiteLink, DashboardSitesLink, SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { ExclamationIcon, FolderAddIcon } from "@heroicons/react/outline";
import { PlusIcon, ViewBoardsIcon } from "@heroicons/react/solid";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useState } from "react";

const EmptyState = () => {
	const [isLoading, setIsLoading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const siteFeatureNotAvailableTitleText = t("common:siteFeatureNotAvailableTitle");
	const siteFeatureNotAvailableMessageText = t("common:siteFeatureNotAvailableMessage");
	const upgradePlanText = t("common:upgradePlan");
	const noAvailableSitesText = t("sites:noAvailableSites");
	const addNewSiteMessageText = t("sites:addNewSiteMessage");
	const addNewSiteText = t("sites:addNewSite");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { asPath, push } = useRouter();

	// Handle `onClick` event on <Link> element
	const handleRouterOnClick = (e) => {
		e.preventDefault();

		const addNewSitePage = AddNewSiteLink + "?step=1&edit=false&verified=false";

		setIsLoading(!isLoading);

		if (asPath === DashboardSitesLink) {
			push(addNewSitePage);
		} else {
			push(SubscriptionPlansSettingsLink);
		}

		setTimeout(() => {
			setIsLoading(!isLoading);
		}, ResetLoadingStateTimeout);
	};

	return (
		<div className="text-center">
			{asPath !== DashboardSitesLink ? (
				<ExclamationIcon className="mx-auto h-12 w-12 text-yellow-400" />
			) : (
				<FolderAddIcon className="mx-auto h-12 w-12 text-gray-400" />
			)}

			<h3 className="mt-2 text-sm font-medium text-gray-900">
				{asPath !== DashboardSitesLink ? siteFeatureNotAvailableTitleText : noAvailableSitesText}
			</h3>
			<p className="mt-1 text-sm text-gray-500">
				{asPath !== DashboardSitesLink ? siteFeatureNotAvailableMessageText : addNewSiteMessageText}
			</p>
			<div className="mt-6">
				<Link href="/" passHref>
					<a
						role="button"
						aria-disabled={isLoading}
						onClick={handleRouterOnClick}
						aria-hidden="true"
						className={classnames(
							"inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ",
							asPath !== DashboardSitesLink
								? isLoading
									? "cursor-not-allowed bg-yellow-500 opacity-50"
									: "cursor-pointer bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
								: isLoading
								? "cursor-not-allowed bg-green-500 opacity-50"
								: "cursor-pointer bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
						)}
					>
						{asPath !== DashboardSitesLink && !isLoading ? (
							<>
								<ViewBoardsIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
								{upgradePlanText}
							</>
						) : asPath === DashboardSitesLink && !isLoading ? (
							<>
								<PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
								{addNewSiteText}
							</>
						) : (
							loaderMessage
						)}
					</a>
				</Link>
			</div>
		</div>
	);
};

/**
 * Memoized custom "EmptyState" component
 */
export const MemoizedEmptyState = memo(EmptyState);
