import { MemoizedLoadingMessage } from "@components/messages/LoadingMessage";
import { MemoizedDataSorting } from "@components/sorting/DataSorting";
import { LinksTableLabels } from "@constants/LinksTableLabels";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedLinksData } from "./LinksData";

/**
 * Custom function to render the `LinksTable` component
 *
 * @param {number} count
 * @param {array} results
 */
const LinksTable = ({ count = 0, results = [] }) => {
	// Translations
	const { t } = useTranslation();
	const noAvailableLinks = t("sites:noAvailableLinks");
	const loaderMessage = t("common:loaderMessage");

	// Router
	const { query } = useRouter();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Sites table labels with translations
	const labelsArray = LinksTableLabels();

	return (
		<section
			className={classnames("flex flex-col", count > 0 && results?.length > 0 ? "justify-start" : "justify-center")}
		>
			{isComponentReady && count && results ? (
				count > 0 && results?.length > 0 ? (
					<table className="relative w-full">
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
								return <MemoizedLinksData key={result.id} link={result} />;
							}) ?? null}
						</tbody>
					</table>
				) : count === 0 && results?.length === 0 ? (
					<div className="flex items-center justify-center px-4 py-5 sm:p-6">
						<MemoizedLoadingMessage message={noAvailableLinks} />
					</div>
				) : null
			) : (
				<div className="flex items-center justify-center px-4 py-5 sm:p-6">
					<MemoizedLoadingMessage message={loaderMessage} />
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
