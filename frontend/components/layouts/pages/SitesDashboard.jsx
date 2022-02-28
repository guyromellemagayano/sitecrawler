import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedSitesTable } from "@components/tables/SitesTable";
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
	const { sitesCount, sitesResults } = useSites(scanApiEndpoint);

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
						"h-full w-full flex-1",
						isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && sitesCount === 0
							? "flex flex-auto"
							: null
					)}
				>
					<div
						className={classnames(
							"h-full w-full flex-1",
							isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								sitesCount === 0 &&
								"flex flex-initial"
						)}
					>
						<div
							className={classnames(
								"h-full w-full flex-1 py-2",
								isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									sitesCount === 0 &&
									"flex items-center"
							)}
						>
							<div className="h-full min-w-full rounded-lg border-gray-300">
								<MemoizedSitesTable count={sitesCount} results={sitesResults} />
							</div>
						</div>
					</div>
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
