import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { SitesSorting } from "@components/sorting/SitesSorting";
import { SitesTableLabels } from "@constants/SitesTableLabels";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useSites } from "@hooks/useSites";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import tw from "twin.macro";
import { MemoizedDataTable } from "./DataTable";

/**
 * Custom function to render the `SitesTable` component
 */
const SitesTable = () => {
	// Translations
	const { t } = useTranslation();
	const noAvailableSites = t("sites:noAvailableSites");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// Custom context
	const { setConfig } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, disableLocalTime } = useUser();
	const { sites, sitesCount, sitesResults } = useSites();

	// Custom hooks
	const { setLinksPerPage, setPagePath } = useSiteQueries();

	// Sites table labels with translations
	const labelsArray = SitesTableLabels();

	return (
		<section
			css={[
				tw`flex flex-col w-full min-h-full h-full`,
				sitesCount > 0 && sitesResults?.length > 0 ? tw`justify-start` : tw`justify-center`
			]}
		>
			{sitesCount > 0 && sitesResults?.length > 0 ? (
				<table tw="relative w-full">
					<thead>
						<tr>
							{labelsArray?.map((label) => (
								<th
									key={label.label}
									className="min-width-adjust"
									tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
								>
									<span tw="flex items-center justify-start">
										<SitesSorting slug={label.slug} labels={labelsArray} setPagePath={setPagePath} />
										<span tw="flex items-center">{label.label}</span>
									</span>
								</th>
							)) ?? null}
						</tr>
					</thead>

					<tbody tw="relative divide-y divide-gray-200">
						{sitesResults.map((result) => {
							return <MemoizedDataTable key={result.id} site={result} />;
						})}
					</tbody>
				</table>
			) : sitesCount === 0 && sitesResults?.length === 1 ? (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<MemoizedLoadingMessage message={noAvailableSites} />
				</div>
			) : (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<MemoizedLoadingMessage message={loaderMessage} />
				</div>
			)}
		</section>
	);
};

SitesTable.propTypes = {
	sites: PropTypes.any
};

/**
 * Memoized custom `SitesTable` component
 */
export const MemoizedSitesTable = memo(SitesTable);
