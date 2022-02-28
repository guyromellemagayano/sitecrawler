import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedPagesTable } from "@components/tables/PagesTable";
import { usePages } from "@hooks/usePages";
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
	const { pagesCount, pagesResults } = usePages(scanApiEndpoint, sanitizedSiteId, scanObjId);

	return (
		<>
			{isComponentReady &&
			user &&
			Math.round(user?.status / 100) === 2 &&
			!user?.data?.detail &&
			permissions.includes("can_see_pages") &&
			permissions.includes("can_see_scripts") &&
			permissions.includes("can_see_stylesheets") &&
			permissions.includes("can_see_images") ? (
				<MemoizedPageOption isPages />
			) : null}
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady &&
						user &&
						Math.round(user?.status / 100) === 2 &&
						!user?.data?.detail &&
						permissions.includes("can_see_pages") &&
						permissions.includes("can_see_scripts") &&
						permissions.includes("can_see_stylesheets") &&
						permissions.includes("can_see_images") &&
						pagesCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							permissions.includes("can_see_pages") &&
							permissions.includes("can_see_scripts") &&
							permissions.includes("can_see_stylesheets") &&
							permissions.includes("can_see_images") &&
							pagesCount === 0
							? "flex items-center justify-center"
							: null
					)}
				>
					<MemoizedPagesTable count={pagesCount} results={pagesResults} />
				</div>
			</div>

			{isComponentReady &&
			user &&
			Math.round(user?.status / 100) === 2 &&
			!user?.data?.detail &&
			permissions.includes("can_see_pages") &&
			permissions.includes("can_see_scripts") &&
			permissions.includes("can_see_stylesheets") &&
			permissions.includes("can_see_images") ? (
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
