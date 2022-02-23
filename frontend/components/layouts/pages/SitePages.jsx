import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedPagesTable } from "@components/tables/PagesTable";
import { usePages } from "@hooks/usePages";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToNumber } from "@utils/convertCase";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import tw from "twin.macro";

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
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-0`,
					isComponentReady &&
					user &&
					Math.round(user?.status / 100) === 2 &&
					!user?.data?.detail &&
					permissions.includes("can_see_pages") &&
					permissions.includes("can_see_scripts") &&
					permissions.includes("can_see_stylesheets") &&
					pagesCount === 0
						? tw`flex flex-col flex-auto items-center justify-center`
						: null
				]}
			>
				<div
					css={[
						tw`flex-1 w-full h-full`,
						isComponentReady &&
						user &&
						Math.round(user?.status / 100) === 2 &&
						!user?.data?.detail &&
						permissions.includes("can_see_pages") &&
						permissions.includes("can_see_scripts") &&
						permissions.includes("can_see_stylesheets") &&
						pagesCount === 0
							? tw`flex flex-auto`
							: null
					]}
				>
					<div
						css={[
							tw`flex-1 w-full h-full`,
							isComponentReady &&
								user &&
								Math.round(user?.status / 100) === 2 &&
								!user?.data?.detail &&
								permissions.includes("can_see_pages") &&
								permissions.includes("can_see_scripts") &&
								permissions.includes("can_see_stylesheets") &&
								pagesCount === 0 &&
								tw`flex flex-initial`
						]}
					>
						<div
							css={[
								tw`flex-1 w-full h-full py-2`,
								isComponentReady &&
									user &&
									Math.round(user?.status / 100) === 2 &&
									!user?.data?.detail &&
									permissions.includes("can_see_pages") &&
									permissions.includes("can_see_scripts") &&
									permissions.includes("can_see_stylesheets") &&
									pagesCount === 0 &&
									tw`flex items-center`
							]}
						>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
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
				<div tw="flex-none">
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
