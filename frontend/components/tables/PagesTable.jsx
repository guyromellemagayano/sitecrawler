import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { MemoizedEmptyState } from "@components/states/EmptyState";
import { PagesTableLabels } from "@constants/PagesTableLabels";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
import { MemoizedPagesData } from "./PagesData";

/**
 * Custom function to render the `PagesTable` component
 *
 * @param {number} count
 * @param {array} results
 * @param {boolean} validatingPages
 */
const PagesTable = ({ count = 0, results = [], validatingPages = false }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailablePages = t("sites:noAvailablePages");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { permissions } = useUser();

	// Sites table labels with translations
	const labelsArray = PagesTableLabels();

	return (
		<section
			css={[
				tw`flex flex-col w-full min-h-full h-full`,
				permissions.includes("can_see_pages") && count > 0 && results?.length > 0
					? tw`justify-start`
					: tw`justify-center`
			]}
		>
			{permissions.includes("can_see_pages") ? (
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
								return <MemoizedPagesData key={result.id} page={result} validatingPages={validatingPages} />;
							}) ?? null}
						</tbody>
					</table>
				) : (
					<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
						{validatingPages ? (
							<Skeleton duration={2} width={120} height={24} />
						) : !validatingPages && count === 0 && results?.length === 0 ? (
							<MemoizedLoadingMessage message={noAvailablePages} />
						) : null}
					</div>
				)
			) : (
				<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
					<MemoizedEmptyState />
				</div>
			)}
		</section>
	);
};

PagesTable.propTypes = {
	count: PropTypes.number,
	results: PropTypes.array,
	validatingPages: PropTypes.bool
};

/**
 * Memoized custom `PagesTable` component
 */
export const MemoizedPagesTable = memo(PagesTable);
