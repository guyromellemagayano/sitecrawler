import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedSitesTable } from "@components/tables/SitesTable";
import { RevalidationInterval } from "@constants/GlobalValues";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";
import "react-loading-skeleton/dist/skeleton.css";

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
	const { user } = useUser();
	const { sitesCount, sitesResults } = useSites(scanApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	return (
		<>
			<MemoizedPageOption isSites />
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && sitesCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && sitesCount === 0
							? "flex items-center justify-center"
							: null
					)}
				>
					<MemoizedSitesTable count={sitesCount} results={sitesResults} />
				</div>
			</div>

			<div className="flex-none">
				<MemoizedDataPagination />
			</div>
		</>
	);
};

/**
 * Memoized custom `SitesDashboardPageLayout` component
 */
export const MemoizedSitesDashboardPageLayout = memo(SitesDashboardPageLayout);
