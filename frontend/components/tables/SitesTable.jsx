import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { SitesSorting } from "@components/sorting/SitesSorting";
import { SitesTableLabels } from "@constants/SitesTableLabels";
import { useSiteQueries } from "@hooks/useSiteQueries";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import tw from "twin.macro";
import { DataTable } from "./DataTable";

/**
 * Custom function to render the `SitesTable` component
 *
 * @param {boolean} validatingSites
 * @param {object} errorSites
 * @param {object} sites
 * @param {boolean} disableLocalTime
 */
const SitesTable = ({ validatingSites = false, errorSites = null, sites = null, disableLocalTime = false }) => {
	// Translations
	const { t } = useTranslation("sites");
	const noAvailableSites = t("noAvailableSites");

	// Router
	const { query } = useRouter();

	// Custom hooks
	const { setLinksPerPage, setPagePath } = useSiteQueries(query);

	// Sites table labels with translations
	const labelsArray = SitesTableLabels();

	return (
		<section
			css={[
				tw`flex flex-col h-full`,
				sites?.data?.count > 0 && sites?.data?.results?.length > 0 ? tw`justify-start` : tw`justify-center`
			]}
		>
			{sites?.data?.count > 0 && sites?.data?.results?.length > 0 ? (
				<table tw="relative w-full">
					<thead>
						<tr>
							{labelsArray?.map((label) => {
								return (
									<th
										key={label.label}
										className="min-width-adjust"
										tw="px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
									>
										<span tw="flex items-center justify-start">
											<SitesSorting result={query} slug={label.slug} labels={label.label} setPagePath={setPagePath} />
											<span tw="flex items-center">{label.label}</span>
										</span>
									</th>
								);
							}) ?? null}
						</tr>
					</thead>

					<tbody tw="relative divide-y divide-gray-200">
						{sites.data.results.map((result) => {
							return (
								<DataTable
									key={result.id}
									site={result}
									validatingSites={validatingSites}
									disableLocalTime={disableLocalTime}
								/>
							);
						})}
					</tbody>
				</table>
			) : (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<MemoizedLoadingMessage message="Loading Sites..." />
				</div>
			)}
		</section>
	);
};

SitesTable.propTypes = {
	sites: PropTypes.shape({
		data: PropTypes.shape({
			count: PropTypes.number,
			results: PropTypes.array
		})
	}),
	validatingSites: PropTypes.bool
};

/**
 * Memoized custom `SitesTable` component
 */
export const MemoizedSitesTable = memo(SitesTable);