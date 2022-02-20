import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { SitesTableLabels } from "@constants/SitesTableLabels";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
import { MemoizedSitesData } from "./SitesData";

/**
 * Custom function to render the `SitesTable` component
 *
 * @param {number} count
 * @param {array} results
 * @param {boolean} validatingSites
 */
const SitesTable = ({ count = 0, results = [], validatingSites = false }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableSites = t("sites:noAvailableSites");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// Sites table labels with translations
	const labelsArray = SitesTableLabels();

	return (
		<section
			css={[
				tw`flex flex-col w-full min-h-full h-full`,
				count > 0 && results?.length > 0 ? tw`justify-start` : tw`justify-center`
			]}
		>
			{count > 0 && results?.length > 0 ? (
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
										<MemoizedDataSorting slug={label.slug} labels={labelsArray} />
										<span tw="flex items-center">{label.label}</span>
									</span>
								</th>
							)) ?? null}
						</tr>
					</thead>

					<tbody tw="relative divide-y divide-gray-200">
						{results?.map((result) => {
							return <MemoizedSitesData key={result.id} site={result} validatingSites={validatingSites} />;
						}) ?? null}
					</tbody>
				</table>
			) : (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					{validatingSites ? (
						<Skeleton duration={2} width={120} height={24} />
					) : !validatingSites && count === 0 && results?.length === 0 ? (
						<MemoizedLoadingMessage message={noAvailableSites} />
					) : null}
				</div>
			)}
		</section>
	);
};

SitesTable.propTypes = {
	count: PropTypes.number,
	results: PropTypes.array,
	validatingSites: PropTypes.bool
};

/**
 * Memoized custom `SitesTable` component
 */
export const MemoizedSitesTable = memo(SitesTable);
