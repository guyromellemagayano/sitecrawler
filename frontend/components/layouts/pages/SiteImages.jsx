import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedImagesTable } from "@components/tables/ImagesTable";
import { useImages } from "@hooks/useImages";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import { memo, useContext } from "react";

/**
 * Custom function to render the `SiteImagesPageLayout` component
 */
const SiteImagesPageLayout = () => {
	// Custom context
	const { isComponentReady, querySiteId, user } = useContext(SiteCrawlerAppContext);

	// Helper functions
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// SWR hooks
	const { images } = useImages(scanApiEndpoint);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;
	const imagesCount = images?.data?.count ?? null;
	const imagesResults = images?.data?.results ?? null;

	return (
		<>
			{isComponentReady && permissions && permissions?.includes("can_see_images") ? (
				<MemoizedPageOption isImages />
			) : null}
			<div
				className={classnames(
					"flex-grow px-4 pt-8 focus:outline-none sm:px-6 md:px-0",
					isComponentReady && permissions && permissions?.includes("can_see_images") && imagesCount === 0
						? "flex flex-auto flex-col items-center justify-center"
						: null
				)}
			>
				<div
					className={classnames(
						"h-full w-full flex-1 overflow-y-hidden py-2",
						isComponentReady && permissions && permissions?.includes("can_see_images") && imagesCount === 0
							? "flex items-center justify-center"
							: null
					)}
				>
					<MemoizedImagesTable count={imagesCount} results={imagesResults} />
				</div>
			</div>

			{isComponentReady && permissions && permissions?.includes("can_see_images") ? (
				<div className="flex-none">
					<MemoizedDataPagination />
				</div>
			) : null}
		</>
	);
};

/**
 * Memoized custom `SiteImagesPageLayout` component
 */
export const MemoizedSiteImagesPageLayout = memo(SiteImagesPageLayout);
