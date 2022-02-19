import { MemoizedPageOption } from "@components/options/PageOption";
import { MemoizedDataPagination } from "@components/pagination";
import { MemoizedLinksTable } from "@components/tables/LinksTable";
import { useLinks } from "@hooks/useLinks";
import { useScan } from "@hooks/useScan";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToNumber } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { memo, useContext } from "react";
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

	console.log(linksResults);

	return (
		<>
			<MemoizedPageOption isLinks />
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
