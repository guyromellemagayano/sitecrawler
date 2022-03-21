import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedLinksTable } from "@components/tables/LinksTable";
import { useLinks } from "@hooks/useLinks";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SiteLinksPageLayout` component
 */
const SiteLinksPageLayout = () => {
	// Custom context
	const { isComponentReady, querySiteId } = useContext(SiteCrawlerAppContext);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { links } = useLinks(scanApiEndpoint);

	// Custom variables
	const linksCount = links?.data?.count ?? null;
	const linksResults = links?.data?.results ?? null;

	return (
		<>
			<MemoizedPageOption isLinks />
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady && linksCount === 0 ? "flex flex-auto flex-col items-center justify-center" : null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady && linksCount === 0 ? "flex items-center justify-center" : null
					)}
				>
					<MemoizedLinksTable count={linksCount} results={linksResults} />
				</div>
			</div>

			<div className="flex-none">
				<MemoizedDataPagination />
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteLinksPageLayout` component
 */
export const MemoizedSiteLinksPageLayout = memo(SiteLinksPageLayout);
