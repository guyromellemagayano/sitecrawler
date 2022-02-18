import { MemoizedFilter } from "@components/filters";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedLinksTable } from "@components/tables/LinksTable";
import { LinkIcon } from "@heroicons/react/outline";
import { useLinks } from "@hooks/useLinks";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `SiteLinksPageLayout` component
 */
const SiteLinksPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const linkText = t("sites:link");
	const linksText = t("sites:links");

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
	const { linksCount, linksResults } = useLinks(scanApiEndpoint, sanitizedSiteId, scanObjId);

	return (
		<>
			<div tw="flex-none px-4 sm:px-6 md:px-0">
				<div tw="flex-1 min-w-0">
					<div tw="mt-4 mb-8 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
						<div tw="mt-2 flex items-center space-x-3 text-sm text-gray-500">
							{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
								linksCount ? (
									<>
										<LinkIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
										<span tw="text-sm leading-6 font-semibold text-gray-500">
											{linksCount > 1
												? linksCount + " " + handleConversionStringToLowercase(linksText)
												: linksCount + " " + linkText}
										</span>
									</>
								) : null
							) : (
								<>
									<Skeleton duration={2} width={20} height={20} className="flex-shrink-0" />
									<Skeleton duration={2} width={60} height={20} />
								</>
							)}
						</div>
					</div>

					<MemoizedFilter isSitesLinksFilter />
				</div>
			</div>

			<div
				css={[
					tw`flex-grow focus:outline-none px-4 pt-8 sm:px-6 md:px-0`,
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && linksCount === 0
						? tw`flex flex-col flex-auto items-center justify-center`
						: null
				]}
			>
				<div
					css={[
						tw`flex-1 w-full h-full`,
						isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && linksCount === 0
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
								linksCount === 0 &&
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
									linksCount === 0 &&
									tw`flex items-center`
							]}
						>
							<div tw="min-w-full h-full rounded-lg border-gray-300">
								<MemoizedLinksTable count={linksCount} results={linksResults} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div tw="flex-none">
				<MemoizedDataPagination />
			</div>
		</>
	);
};

/**
 * Memoized custom `SiteLinksPageLayout` component
 */
export const MemoizedSiteLinksPageLayout = memo(SiteLinksPageLayout);
