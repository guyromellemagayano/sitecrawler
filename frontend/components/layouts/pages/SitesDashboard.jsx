import { MemoizedSitesTable } from "@components/tables/SitesTable";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useLoading } from "@hooks/useLoading";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SitesDashboardPageLayout` component
 */
const SitesDashboardPageLayout = () => {
	const [disableLocalTime, setDisableLocalTime] = useState(false);

	// Translations
	const { t } = useTranslation();
	const siteText = t("sites:site");
	const sitesText = t("sites:sites");

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const { isComponentReady } = useLoading();

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// `user` SWR hook
	const { user, errorUser, validatingUser } = useUser();

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `user` SWR hook fetch
			errorUser
				? setConfig({
						isSites: true,
						method: errorUser?.config?.method ?? null,
						status: errorUser?.status ?? null
				  })
				: null;

			// Update `disableLocalTime` user setting
			if (!validatingUser && !errorUser && user && !user?.data?.detail && user?.data?.settings) {
				if (
					Object.prototype.hasOwnProperty.call(user.data.settings, "disableLocalTime") &&
					Boolean(user.data.settings?.disableLocalTime)
				) {
					setDisableLocalTime(Boolean(user.data.settings.disableLocalTime));
				}
			}

			return disableLocalTime;
		})();

		return () => {
			isMounted = false;
		};
	}, [user, errorUser, validatingUser]);

	// `sites` SWR hook
	const { sites, errorSites, validatingSites } = useSites(scanApiEndpoint, {
		revalidateOnFocus: false
	});

	useMemo(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `sites` SWR hook fetch
			errorSites
				? setConfig({
						isSites: true,
						method: errorSites?.config?.method ?? null,
						status: errorSites?.status ?? null
				  })
				: null;
		})();

		return () => {
			isMounted = false;
		};
	}, [sites, errorSites]);

	return (
		<>
			<div tw="flex-none px-4 sm:px-6 md:px-0">
				<div tw="flex-1 min-w-0">
					<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
						<div tw="mt-2 flex items-center space-x-3 text-sm text-gray-500">
							{isComponentReady ? (
								sites?.data?.count ? (
									<>
										<ExternalLinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 font-semibold text-gray-500">
											{sites.data.count > 1
												? sites.data.count + " " + handleConversionStringToLowercase(sitesText)
												: sites.data.count + " " + siteText}
										</span>
									</>
								) : null
							) : (
								<>
									<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
									<Skeleton duration={2} width={60} height={20} />
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			<div
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-0`,
					isComponentReady && sites?.data?.count === 0 ? tw`flex flex-col flex-auto items-center justify-center` : null
				]}
			>
				<div css={[tw`flex-1 w-full h-full`, isComponentReady && sites?.data?.count === 0 ? tw`flex flex-auto` : null]}>
					<div css={[tw`flex-1 w-full h-full`, isComponentReady && sites?.data?.count === 0 && tw`flex flex-initial`]}>
						<div
							css={[
								tw`flex-1 w-full h-full py-2`,
								isComponentReady && sites?.data?.count === 0 && tw`flex items-center`
							]}
						>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								<MemoizedSitesTable
									sites={sites}
									validatingSites={validatingSites}
									disableLocalTime={disableLocalTime}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <div tw="flex-none">
				<MemoizedDataPagination />
			</div> */}
		</>
	);
};

/**
 * Memoized custom `SitesDashboardPageLayout` component
 */
export const MemoizedSitesDashboardPageLayout = memo(SitesDashboardPageLayout);
