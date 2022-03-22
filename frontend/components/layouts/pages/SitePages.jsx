import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedPagesTable } from "@components/tables/PagesTable";
import { usePages } from "@hooks/usePages";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SitePagesPageLayout` component
 */
const SitePagesPageLayout = () => {
	// Custom context
	const { isComponentReady, querySiteId, user } = useContext(SiteCrawlerAppContext);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { pages } = usePages(scanApiEndpoint);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;
	const pagesCount = pages?.data?.count ?? null;
	const pagesResults = pages?.data?.results ?? null;

	return (
		<>
			{isComponentReady &&
			permissions &&
			permissions?.includes("can_see_pages") &&
			permissions?.includes("can_see_scripts") &&
			permissions?.includes("can_see_stylesheets") ? (
				<MemoizedPageOption isPages />
			) : null}
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady &&
						permissions &&
						permissions?.includes("can_see_pages") &&
						permissions?.includes("can_see_scripts") &&
						permissions?.includes("can_see_stylesheets") &&
						pagesCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady &&
							permissions &&
							permissions?.includes("can_see_pages") &&
							permissions?.includes("can_see_scripts") &&
							permissions?.includes("can_see_stylesheets") &&
							pagesCount === 0
							? "flex items-center justify-center"
							: null
					)}
				>
					<MemoizedPagesTable count={pagesCount} results={pagesResults} />
				</div>
			</div>

			{isComponentReady &&
			permissions &&
			permissions?.includes("can_see_pages") &&
			permissions?.includes("can_see_scripts") &&
			permissions?.includes("can_see_stylesheets") ? (
				<div className="flex-none">
					<MemoizedDataPagination />
				</div>
			) : null}
		</>
	);
};

/**
 * Memoized custom `SitePagesPageLayout` component
 */
export const MemoizedSitePagesPageLayout = memo(SitePagesPageLayout);
