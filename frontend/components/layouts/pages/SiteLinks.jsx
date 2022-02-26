import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedLinksTable } from "@components/tables/LinksTable";
import { useLinks } from "@hooks/useLinks";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { handleConversionStringToNumber } from "@utils/convertCase";
import { useRouter } from "next/router";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SiteLinksPageLayout` component
 */
const SiteLinksPageLayout = () => {
	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Router
	const { query } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanObjId } = useScan(sanitizedSiteId);
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { user } = useUser();
	const { linksCount, linksResults, validatingLinks } = useLinks(scanApiEndpoint, sanitizedSiteId, scanObjId);

	return (
		<>
			<MemoizedPageOption isLinks />
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && linksCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1",
						isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && linksCount === 0
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
								linksCount === 0 &&
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
									linksCount === 0 &&
									"flex items-center"
							)}
						>
							<div className="h-full min-w-full rounded-lg border-gray-300">
								<MemoizedLinksTable count={linksCount} results={linksResults} validatingLinks={validatingLinks} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-none">
				<MemoizedDataPagination isValidating={validatingLinks} />
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteLinksPageLayout` component
 */
export const MemoizedSiteLinksPageLayout = memo(SiteLinksPageLayout);
