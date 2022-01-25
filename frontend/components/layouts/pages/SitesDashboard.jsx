import { MemoizedDataPagination } from "@components/pagination";
import { SitesTable } from "@components/tables/SitesTable";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useItemsPerPageChange } from "@hooks/useItemsPerPageChange";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo } from "react";
import tw from "twin.macro";
import { Footer } from "../components/Footer";

/**
 * Custom function to render the `SitesDashboardPageLayout` component
 */
const SitesDashboardPageLayout = () => {
	// Translations
	const { t } = useTranslation("sites");
	const site = t("site");

	// Router
	const { query } = useRouter();

	// Helper functions
	const { linksPerPage, setLinksPerPage, pagePath, setPagePath } = useSiteQueries(query);
	const { scanApiEndpoint } = useScanApiEndpoint(query, linksPerPage);

	// SWR hooks
	const { sites, validatingSites } = useSites({
		endpoint: scanApiEndpoint
	});

	// Custom hook that handles items per page change
	const useHandleItemsPerPageChange = async ({ count }) => {
		return await useItemsPerPageChange(scanApiEndpoint, count, setLinksPerPage, setPagePath);
	};

	return (
		<>
			{sites?.count > 0 ? (
				<div tw="flex-none px-4 pt-12 sm:px-6 md:px-8 md:flex md:items-start md:justify-between">
					<div tw="flex-1 min-w-0">
						<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{sites}</h2>
						<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
							<div tw="mt-2 flex items-center text-sm text-gray-500">
								<ExternalLinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
								<span tw="text-sm leading-6 font-semibold text-gray-500">
									{sites?.count + " "}
									{sites?.count > 1 ? sites : site}
								</span>
							</div>
						</div>
					</div>
				</div>
			) : null}

			<div
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-8`,
					sites?.count < 1 ? tw`flex flex-col flex-auto items-center justify-center` : null
				]}
			>
				<div css={[tw`flex-1 w-full h-full`, sites?.count < 1 ? tw`flex flex-auto` : null]}>
					<div css={[tw`flex-1 w-full h-full`, sites?.count < 1 && tw`flex flex-initial`]}>
						<div css={[tw`flex-1 w-full h-full py-2 overflow-x-auto`, sites?.count < 1 && tw`flex items-center`]}>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								<SitesTable />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div tw="flex-none px-4 sm:px-6 md:px-8">
				<MemoizedDataPagination
					activePage={parseInt(query?.page > 0 ? query?.page : 0)}
					apiEndpoint={scanApiEndpoint}
					handleItemsPerPageChange={useHandleItemsPerPageChange}
					linksPerPage={parseInt(linksPerPage)}
					pathName={pagePath}
					componentReady={!validatingSites}
				/>

				<div tw="w-full p-4 border-t border-gray-200">
					<Footer />
				</div>
			</div>
		</>
	);
};

/**
 * Memoized custom `SitesDashboardPageLayout` component
 */
export const MemoizedSitesDashboardPageLayout = memo(SitesDashboardPageLayout);
