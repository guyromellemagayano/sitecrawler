import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedSitesTable } from "@components/tables/SitesTable";
import { RevalidationInterval } from "@constants/GlobalValues";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SitesDashboardPageLayout` component
 */
const SitesDashboardPageLayout = () => {
	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { sites } = useSites(scanApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	// Custom variables
	const sitesCount = sites?.data?.count ?? null;
	const sitesResults = sites?.data?.results ?? null;

	return (
		<>
			<MemoizedPageOption isSites />
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady && sitesCount === 0 && sitesResults?.length === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady && sitesCount === 0 && sitesResults?.length === 0
							? "flex items-center justify-center"
							: null
					)}
				>
					<MemoizedSitesTable count={sitesCount} results={sitesResults} />
				</div>
			</div>

			<div
				className={classnames(
					isComponentReady && sitesCount === 0 && sitesResults?.length === 0 ? "hidden" : "flex-none"
				)}
			>
				<MemoizedDataPagination />
			</div>
		</>
	);
};

/**
 * Memoized custom `SitesDashboardPageLayout` component
 */
export const MemoizedSitesDashboardPageLayout = memo(SitesDashboardPageLayout);
