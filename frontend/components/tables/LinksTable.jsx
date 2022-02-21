import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { LinksTableLabels } from "@constants/LinksTableLabels";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
import { MemoizedLinksData } from "./LinksData";

/**
 * Custom function to render the `LinksTable` component
 *
 * @param {number} count
 * @param {array} results
 * @param {boolean} validatingLinks
 */
const LinksTable = ({ count = 0, results = [], validatingLinks = false }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableLinks = t("sites:noAvailableLinks");

	// Router
	const { query } = useRouter();

	// Sites table labels with translations
	const labelsArray = LinksTableLabels();

	return (
		<section
			css={[
				tw`flex flex-col w-full min-h-full h-full`,
				!validatingLinks && count > 0 && results?.length > 0 ? tw`justify-start` : tw`justify-center`
			]}
		>
			{!validatingLinks ? (
				count > 0 && results?.length > 0 ? (
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
								return <MemoizedLinksData key={result.id} link={result} validatingLinks={validatingLinks} />;
							}) ?? null}
						</tbody>
					</table>
				) : (
					<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
						<MemoizedLoadingMessage message={noAvailableLinks} />
					</div>
				)
			) : (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<Skeleton duration={2} width={120} height={24} />
				</div>
			)}
		</section>
	);
};

LinksTable.propTypes = {
	count: PropTypes.number,
	results: PropTypes.array,
	validatingLinks: PropTypes.bool
};

/**
 * Memoized custom `LinksTable` component
 */
export const MemoizedLinksTable = memo(LinksTable);
