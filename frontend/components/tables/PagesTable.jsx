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
import Scrollbars from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
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
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { permissions } = useUser();

	// Sites table labels with translations
	const labelsArray = PagesTableLabels();

	return (
		<Scrollbars autoHide universal>
			<section
				className={classnames(
					"flex h-full min-h-full w-full flex-col",
					permissions.includes("can_see_pages") &&
						permissions.includes("can_see_scripts") &&
						permissions.includes("can_see_stylesheets") &&
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
					count &&
					results ? (
						count > 0 && results?.length > 0 ? (
							<table>
								<thead>
									<tr>
										{labelsArray?.map((label) => (
											<th
												key={label.label}
												className="min-w-[18rem] border-b border-gray-200 px-6 py-3 text-left text-xs font-medium uppercase leading-4 tracking-wider text-gray-500"
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
										return <MemoizedPagesData key={result.id} page={result} validatingPages={validatingPages} />;
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
		</Scrollbars>
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
