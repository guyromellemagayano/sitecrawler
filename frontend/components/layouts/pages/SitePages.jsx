import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedPagesTable } from "@components/tables/PagesTable";
import { usePages } from "@hooks/usePages";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import { handleConversionStringToNumber } from "@utils/convertCase";
import { useRouter } from "next/router";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SitePagesPageLayout` component
 */
const SitePagesPageLayout = () => {
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
	const { user, permissions } = useUser();
	const { pagesCount, pagesResults, validatingPages } = usePages(scanApiEndpoint, sanitizedSiteId, scanObjId);

	return (
		<>
			{isComponentReady &&
			user &&
			Math.round(user?.status / 100) === 2 &&
			!user?.data?.detail &&
			permissions.includes("can_see_pages") &&
			permissions.includes("can_see_scripts") &&
			permissions.includes("can_see_stylesheets") ? (
				<MemoizedPageOption isPages />
			) : null}
			<div
				className={classNames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady &&
						user &&
						Math.round(user?.status / 100) === 2 &&
						!user?.data?.detail &&
						permissions.includes("can_see_pages") &&
						permissions.includes("can_see_scripts") &&
						permissions.includes("can_see_stylesheets") &&
						pagesCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classNames(
						"h-full w-full flex-1",
						isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							permissions.includes("can_see_pages") &&
							permissions.includes("can_see_scripts") &&
							permissions.includes("can_see_stylesheets") &&
							pagesCount === 0
							? "flex flex-auto"
							: null
					)}
				>
					<div
						className={classNames(
							"h-full w-full flex-1",
							isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								permissions.includes("can_see_pages") &&
								permissions.includes("can_see_scripts") &&
								permissions.includes("can_see_stylesheets") &&
								pagesCount === 0 &&
								"flex flex-initial"
						)}
					>
						<div
							className={classNames(
								"h-full w-full flex-1 py-2",
								isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									permissions.includes("can_see_pages") &&
									permissions.includes("can_see_scripts") &&
									permissions.includes("can_see_stylesheets") &&
									pagesCount === 0 &&
									"flex items-center"
							)}
						>
							<div className="h-full min-w-full rounded-lg border-gray-300">
								<MemoizedPagesTable count={pagesCount} results={pagesResults} validatingPages={validatingPages} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{isComponentReady &&
			user &&
			Math.round(user?.status / 100) === 2 &&
			!user?.data?.detail &&
			permissions.includes("can_see_pages") &&
			permissions.includes("can_see_scripts") &&
			permissions.includes("can_see_stylesheets") ? (
				<div className="flex-none">
					<MemoizedDataPagination isValidating={validatingPages} />
				</div>
			) : null}
		</>
	);
};

/**
 * Memoized custom `SitePagesPageLayout` component
 */
export const MemoizedSitePagesPageLayout = memo(SitePagesPageLayout);
