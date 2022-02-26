import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { MemoizedEmptyState } from "@components/states/EmptyState";
import { ImagesTableLabels } from "@constants/ImagesTableLabels";
import { useUser } from "@hooks/useUser";
import { classNames } from "@utils/classNames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedImagesData } from "./ImagesData";

/**
 * Custom function to render the `ImagesTable` component
 *
 * @param {number} count
 * @param {array} results
 * @param {boolean} validatingImages
 */
const ImagesTable = ({ count = 0, results = [], validatingImages = false }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableImages = t("sites:noAvailableImages");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// SWR hooks
	const { permissions } = useUser();

	// Sites table labels with translations
	const labelsArray = ImagesTableLabels();

	return (
		<Scrollbars autoHide universal>
			<section
				className={classNames(
					"flex h-full min-h-full w-full flex-col",
					permissions.includes("can_see_images") && count > 0 && results?.length > 0
						? "justify-start"
						: "justify-center"
				)}
			>
				{permissions?.length > 0 ? (
					permissions.includes("can_see_images") && count && results ? (
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
										return <MemoizedImagesData key={result.id} image={result} validatingImages={validatingImages} />;
									}) ?? null}
								</tbody>
							</table>
						) : count === 0 && results?.length === 0 ? (
							<div className="flex items-center justify-center px-4 py-5 sm:p-6">
								<MemoizedLoadingMessage message={noAvailableImages} />
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

ImagesTable.propTypes = {
	count: PropTypes.number,
	results: PropTypes.array,
	validatingImages: PropTypes.bool
};

/**
 * Memoized custom `ImagesTable` component
 */
export const MemoizedImagesTable = memo(ImagesTable);
