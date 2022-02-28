import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { MemoizedEmptyState } from "@components/states/EmptyState";
import { PagesTableLabels } from "@constants/PagesTableLabels";
import { useUser } from "@hooks/useUser";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedPagesData } from "./PagesData";

/**
 * Custom function to render the `PagesTable` component
 *
 * @param {number} count
 * @param {array} results
 */
const PagesTable = ({ count = 0, results = [] }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailablePages = t("sites:noAvailablePages");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { permissions } = useUser();

	// Sites table labels with translations
	const labelsArray = PagesTableLabels();

	return (
		<section
			className={classnames(
				"flex flex-col",
				permissions.includes("can_see_pages") &&
					permissions.includes("can_see_scripts") &&
					permissions.includes("can_see_stylesheets") &&
					permissions.includes("can_see_images") &&
					count > 0 &&
					results?.length > 0
					? "justify-start"
					: "justify-center"
			)}
		>
			{permissions?.length > 0 ? (
				permissions.includes("can_see_pages") &&
				permissions.includes("can_see_scripts") &&
				permissions.includes("can_see_stylesheets") &&
				permissions.includes("can_see_images") &&
				count &&
				results ? (
					count > 0 && results?.length > 0 ? (
						<table>
							<thead>
								<tr>
									{labelsArray?.map((label) => (
										<th
											key={label.label}
											className="min-w-[24rem] border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500"
										>
											<span className="flex items-center justify-start">
												<MemoizedDataSorting slug={label.slug} labels={labelsArray} />
												<span className="flex items-center">{label.label}</span>
											</span>
										</th>
									)) ?? null}
								</tr>
							</thead>

							<tbody className="relative divide-y divide-gray-200">
								{results?.map((result) => {
									return <MemoizedPagesData key={result.id} page={result} />;
								}) ?? null}
							</tbody>
						</table>
					) : count === 0 && results?.length === 0 ? (
						<div className="flex items-center justify-center px-4 py-5 sm:p-6">
							<MemoizedLoadingMessage message={noAvailablePages} />
						</div>
					) : null
				) : (
					<div className="flex items-center justify-center px-4 py-5 sm:p-6">
						<MemoizedEmptyState />
					</div>
				)
			) : (
				<div className="flex items-center justify-center px-4 py-5 sm:p-6">
					<MemoizedLoadingMessage message={loaderMessage} />
				</div>
			)}
		</section>
	);
};

PagesTable.propTypes = {
	count: PropTypes.number,
	results: PropTypes.array
};

/**
 * Memoized custom `PagesTable` component
 */
export const MemoizedPagesTable = memo(PagesTable);
