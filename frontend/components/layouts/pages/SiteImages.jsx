import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedImagesTable } from "@components/tables/ImagesTable";
import { useImages } from "@hooks/useImages";
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
 * Custom function to render the `SiteImagesPageLayout` component
 */
const SiteImagesPageLayout = () => {
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
	const { imagesCount, imagesResults, validatingImages } = useImages(scanApiEndpoint, sanitizedSiteId, scanObjId);

	return (
		<>
			{isComponentReady &&
			user &&
			Math.round(user?.status / 100) === 2 &&
			!user?.data?.detail &&
			permissions.includes("can_see_images") ? (
				<MemoizedPageOption isLinks />
			) : null}
			<div
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-0`,
					isComponentReady &&
					user &&
					Math.round(user?.status / 100) === 2 &&
					!user?.data?.detail &&
					permissions.includes("can_see_images") &&
					imagesCount === 0
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
						permissions.includes("can_see_images") &&
						imagesCount === 0
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
								permissions.includes("can_see_images") &&
								imagesCount === 0 &&
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
									permissions.includes("can_see_images") &&
									imagesCount === 0 &&
									tw`flex items-center`
							]}
						>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								<MemoizedImagesTable count={imagesCount} results={imagesResults} validatingImages={validatingImages} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div tw="flex-none">
				<MemoizedDataPagination isValidating={validatingImages} />
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteImagesPageLayout` component
 */
export const MemoizedSiteImagesPageLayout = memo(SiteImagesPageLayout);
