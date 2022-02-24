import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { MemoizedEmptyState } from "@components/states/EmptyState";
import { ImagesTableLabels } from "@constants/ImagesTableLabels";
import { useUser } from "@hooks/useUser";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";
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
				css={[
					tw`flex flex-col w-full min-h-full h-full`,
					permissions.includes("can_see_images") && count > 0 && results?.length > 0
						? tw`justify-start`
						: tw`justify-center`
				]}
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
										return <MemoizedImagesData key={result.id} image={result} validatingImages={validatingImages} />;
									}) ?? null}
								</tbody>
							</table>
						) : count === 0 && results?.length === 0 ? (
							<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
								<MemoizedLoadingMessage message={noAvailableImages} />
							</div>
						) : null
					) : (
						<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
							<MemoizedEmptyState />
						</div>
					)
				) : (
					<div tw="px-4 py-5 sm:p-6 flex items-center justify-center">
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
