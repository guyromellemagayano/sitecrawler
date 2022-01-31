import { MemoizedPaginationSkeleton } from "@components/skeletons/PaginationSkeleton";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useLoading } from "@hooks/useLoading";
import { usePage } from "@hooks/usePage";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { memo, useEffect, useState } from "react";
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
 */
const DataPagination = ({
	activePage = null,
	apiEndpoint = null,
	handleItemsPerPageChange,
	linksPerPage = null,
	pathName = null
}) => {
	const [pageData, setPageData] = useState([]);

	const currentPage = activePage || 1;
	const linkNumbers = [];
	const offset = (currentPage - 1) * linksPerPage;
	const pageNumbers = [];
	const values = [20, 25, 50, 100];

	// Router
	const router = useRouter();

	// Custom hooks
	const { page } = usePage({
		endpoint: apiEndpoint
	});
	const { isComponentReady } = useLoading();

	// Custom functions
	const handlePageChange = (pageNum) => {
		const newPath = handleRemoveUrlParameter(pathName, "page");

		router.push(`${newPath}page=${pageNum}`);
	};

	useEffect(() => {
		page ? setPageData(page) : null;
	}, [page]);

	const totalPages = Math.ceil(pageData.count / linksPerPage);

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	if (totalPages < 1) return null;

	for (let i = 1; i <= pageData.count; i++) {
		linkNumbers.push(i);
	}

	const paginatedItems = linkNumbers.slice(offset).slice(0, linksPerPage);

	return isComponentReady ? (
		<div tw="bg-white mb-4 py-2 lg:flex items-center justify-between align-middle">
			<div tw="flex items-center mb-8 lg:m-0">
				<div tw="mt-2 lg:my-0">
					<p tw="text-center lg:text-left text-sm leading-5 text-gray-500">
						Showing
						<span tw="px-1 font-medium">{paginatedItems[0] || 0}</span>
						to
						<span tw="px-1 font-medium">{paginatedItems[paginatedItems.length - 1] || 0}</span>
						of
						<span tw="px-1 font-medium">{page?.count}</span>
						results
					</p>
				</div>
			</div>

			{/* TODO: Fix UI of previous and next buttons when they reach their first or last pages */}
			<Pagination
				current={currentPage}
				defaultCurrent={currentPage}
				defaultPageSize={values[0]}
				disabled={!isComponentReady}
				locale={PaginationLocale}
				nextIcon="Next"
				onChange={handlePageChange}
				pageSize={linksPerPage}
				prevIcon="Previous"
				showPrevNextJumpers={true}
				showTitle={false}
				total={totalPages * linksPerPage}
			/>

			<div tw="flex items-center mt-4 lg:m-0">
				<h1 tw="-mt-px pr-4 inline-flex items-center text-sm leading-5 font-normal text-gray-500">Rows per page</h1>
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
