import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { MemoizedEmptyState } from "@components/states/EmptyState";
import { SitesTableLabels } from "@constants/SitesTableLabels";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
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
		<Scrollbars autoHide universal>
			<section
				css={[
					tw`flex flex-col w-full min-h-full h-full`,
					!validatingSites && count > 0 && results?.length > 0 ? tw`justify-start` : tw`justify-center`
				]}
			>
				{!validatingSites && count > 0 && results ? (
					count > 0 && results?.length > 0 ? (
						<table tw="relative w-full">
							<thead>
								<tr>
									{labelsArray?.map((label) => (
										<th
											key={label.label}
											tw="min-w-[18rem] px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
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
					) : count === 0 && results?.length === 0 ? (
						<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
							<MemoizedEmptyState />
						</div>
					) : null
				) : (
					<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
						<MemoizedLoadingMessage message={loaderMessage} />
					</div>
				)}
			</section>
		</Scrollbars>
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
