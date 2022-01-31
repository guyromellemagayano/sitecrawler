import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedSitesTable } from "@components/tables/SitesTable";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useItemsPerPageChange } from "@hooks/useItemsPerPageChange";
import { useLoading } from "@hooks/useLoading";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { handleConversionStringToLowercase } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useMemo, useState } from "react";
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

	// Router
	const { query } = useRouter();

	// Custom hooks
	const { state, setConfig } = useAlertMessage();
	const { isComponentReady } = useLoading();

	// Helper functions
	const { linksPerPage, setLinksPerPage, pagePath, setPagePath } = useSiteQueries(query);
	const { scanApiEndpoint } = useScanApiEndpoint(query, linksPerPage);

	// `user` SWR hook
	const { user, errorUser, validatingUser } = useUser();

	// `sites` SWR hook
	const { sites, errorSites, validatingSites } = useSites(scanApiEndpoint);

	// TODO: Error handling for `user` SWR hook
	useMemo(() => {
		// Show alert message after failed `user` SWR hook fetch
		errorUser?.length > 0
			? setConfig({
					isUser: true,
					method: errorUser?.config?.method ?? null,
					status: errorUser?.status ?? null
			  })
			: null;
	}, [errorUser]);

	// Update `disableLocalTime` user setting
	useMemo(() => {
		let isMounted = true;

		// Disable local time after `user` SWR hook fetch
		(async () => {
			if (!isMounted) return;

			if (!validatingUser && user?.length > 0) {
				if (Object.keys(user.data?.settings)?.length > 0) {
					if (
						Object.prototype.hasOwnProperty.call(user.data?.settings, "disableLocalTime") &&
						Boolean(user.data.settings.disableLocalTime)
					) {
						setDisableLocalTime(Boolean(user.data.settings.disableLocalTime));
					}
				}
			}

			return { disableLocalTime };
		})();

		return () => {
			isMounted = false;
		};
	}, [user, validatingUser]);

	// TODO: Error handling for `sites` SWR hook
	useMemo(() => {
		// Show alert message after failed `sites` SWR hook fetch
		errorSites?.length > 0
			? setConfig({
					isUser: true,
					method: errorSites?.config?.method ?? null,
					status: errorSites?.status ?? null
			  })
			: null;
	}, [errorSites]);

	// Custom hook that handles items per page change
	const useHandleItemsPerPageChange = async ({ count }) => {
		return await useItemsPerPageChange(scanApiEndpoint, count, setLinksPerPage, setPagePath);
	};

	return (
		<>
			{
				<div tw="flex-none px-4 sm:px-6 md:px-0">
					<div tw="flex-1 min-w-0">
						<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
							<div tw="mt-2 flex items-center space-x-3 text-sm text-gray-500">
								{isComponentReady && sites?.data?.count > 0 && sites?.data?.results?.length > 0 ? (
									<>
										<ExternalLinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 font-semibold text-gray-500">
											{sites?.data?.count + " "}
											{sites?.data?.count > 1 ? handleConversionStringToLowercase(sitesText) : siteText}
										</span>
									</>
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
			}

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
								tw`flex-1 w-full h-full py-2 overflow-x-auto`,
								isComponentReady && sites?.data?.count === 0 && tw`flex items-center`
							]}
						>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								<section
									css={[
										tw`flex flex-col h-full`,
										isComponentReady && sites?.data?.count > 0 && sites?.data?.results?.length > 0
											? tw`justify-start`
											: tw`justify-center`
									]}
								>
									<MemoizedSitesTable
										validatingSites={validatingSites}
										errorSites={errorSites}
										sites={sites}
										disableLocalTime={disableLocalTime}
									/>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div tw="flex-none">
				<MemoizedDataPagination
					activePage={query?.page ? parseInt(query.page) : 0}
					apiEndpoint={scanApiEndpoint}
					handleItemsPerPageChange={useHandleItemsPerPageChange}
					linksPerPage={parseInt(linksPerPage)}
					pathName={pagePath}
					isComponentReady={validatingSites}
				/>
			</div>
		</>
	);
};

/**
 * Memoized custom `SitesDashboardPageLayout` component
 */
export const MemoizedSitesDashboardPageLayout = memo(SitesDashboardPageLayout);
