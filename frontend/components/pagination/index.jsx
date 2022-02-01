import { MemoizedPaginationSkeleton } from "@components/skeletons/PaginationSkeleton";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { usePage } from "@hooks/usePage";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { memo, useMemo, useState } from "react";
import "twin.macro";

// Pagination strings
const PaginationLocale = {
	items_per_page: "Rows per Page",
	jump_to: "Goto",
	jump_to_confirm: "Goto",
	page: "Page",
	prev_page: "Previous",
	next_page: "Next",
	prev_5: "Prev 5",
	next_5: "Next 5",
	prev_3: "Prev 3",
	next_3: "Next 3"
};

/**
 * Custom function to render the `Pagination` component
 *
 * @param {number} activePage
 * @param {sting} apiEndpoint
 * @param {function} handleItemsPerPageChange
 * @param {number} linksPerPage
 * @param {string} pathName
 * @param {boolean} isComponentReady
 */
const DataPagination = ({
	activePage = null,
	apiEndpoint = null,
	handleItemsPerPageChange,
	linksPerPage = null,
	pathName = null,
	isComponentReady = false
}) => {
	const [pageData, setPageData] = useState(null);

	// Custom variables
	const currentPage = activePage || 1;
	const linkNumbers = [];
	const offset = (currentPage - 1) * linksPerPage;
	const pageNumbers = [];
	const values = [20, 25, 50, 100];

	// Translations
	const { t } = useTranslation();
	const showingText = t("common:showing");
	const toText = t("common:to");
	const ofText = t("common:of");
	const nextText = t("common:next");
	const previousText = t("common:previous");
	const resultsText = t("common:results");
	const rowsPerPageText = t("common:rowsPerPage");

	// Router
	const router = useRouter();

	// Custom hooks
	const { page, errorPage, validatingPage } = usePage(apiEndpoint);
	const { state, setConfig } = useAlertMessage();

	// TODO: Error handling for `page` SWR hook
	useMemo(() => {
		errorPage
			? setConfig({
					isPage: true,
					method: errorPage?.config?.method ?? null,
					status: errorPage?.status ?? null
			  })
			: null;
	}, [errorPage]);

	// Handle `page` object change
	useMemo(() => {
		let isMounted = true;

		// Update `pageData` state after `page` SWR hook fetch
		(() => {
			if (!isMounted) return;

			if (!validatingPage) {
				if (page?.data) {
					setPageData(page.data);
				}
			}

			return pageData;
		})();

		return () => {
			isMounted = false;
		};
	}, [page, validatingPage]);

	const totalPages = pageData?.count && linksPerPage !== null ? Math.ceil(pageData.count / linksPerPage) : null;

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	if (totalPages < 1) return null;

	if (pageData?.count) {
		for (let i = 1; i <= pageData.count; i++) {
			linkNumbers.push(i);
		}
	}

	const paginatedItems = linksPerPage !== null ? linkNumbers.slice(offset).slice(0, linksPerPage) : null;

	// Custom functions
	const handlePageChange = (pageNum) => {
		const newPath = handleRemoveUrlParameter(pathName, "page");

		router.push(`${newPath}page=${pageNum}`);
	};

	return isComponentReady ? (
		<div tw="bg-white mb-4 py-2 lg:flex items-center justify-between align-middle">
			<div tw="flex items-center mb-8 lg:m-0">
				<div tw="mt-2 lg:my-0">
					<p tw="text-center lg:text-left text-sm leading-5 text-gray-500">
						{showingText}
						<span tw="px-1 font-medium">{paginatedItems[0] || 0}</span>
						{toText}
						<span tw="px-1 font-medium">{paginatedItems[paginatedItems.length - 1] || 0}</span>
						{ofText}
						<span tw="px-1 font-medium">{pageData?.count || 0}</span>
						{resultsText}
					</p>
				</div>
			</div>

			{/* TODO: Fix UI of previous and next buttons when they reach their first or last pages */}
			<Pagination
				className="pagination"
				current={currentPage}
				defaultCurrent={currentPage}
				defaultPageSize={values[0]}
				disabled={!isComponentReady}
				locale={PaginationLocale}
				nextIcon={nextText}
				onChange={handlePageChange}
				pageSize={linksPerPage}
				prevIcon={previousText}
				showPrevNextJumpers={true}
				showLessItems={true}
				showTitle={false}
				total={totalPages * linksPerPage}
			/>

			<div tw="flex items-center mt-4 lg:m-0">
				<h1 tw="-mt-px pr-4 inline-flex items-center text-sm leading-5 font-normal text-gray-500">{rowsPerPageText}</h1>
				<div>
					<select
						onChange={handleItemsPerPageChange}
						value={linksPerPage}
						tw="block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md sm:leading-5"
					>
						{values.map((val, key) => {
							return (
								<option key={key} value={val}>
									{val === 20 ? "--" : val}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		</div>
	) : (
		<MemoizedPaginationSkeleton />
	);
};

DataPagination.propTypes = {
	activePage: PropTypes.number,
	apiEndpoint: PropTypes.string,
	handleItemsPerPageChange: PropTypes.func,
	linksPerPage: PropTypes.number,
	pathName: PropTypes.string
};

export const MemoizedDataPagination = memo(DataPagination);
