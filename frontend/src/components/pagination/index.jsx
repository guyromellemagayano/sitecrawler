import PaginationSkeleton from "@components/skeletons/PaginationSkeleton";
import { handleRemoveURLParameter } from "@helpers/handleRemoveUrlParameter";
import { usePage } from "@hooks/usePage";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { useState, useEffect } from "react";
import "twin.macro";

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

const DataPagination = ({
	activePage,
	apiEndpoint,
	componentReady,
	handleItemsPerPageChange,
	linksPerPage,
	pathName
}) => {
	const [pageData, setPageData] = useState([]);

	const currentPage = activePage || 1;
	const linkNumbers = [];
	const offset = (currentPage - 1) * linksPerPage;
	const pageNumbers = [];
	const values = [20, 25, 50, 100];

	const router = useRouter();

	const { page } = usePage({
		endpoint: apiEndpoint
	});

	const handlePageChange = (pageNum) => {
		const newPath = handleRemoveURLParameter(pathName, "page");

		router.push(`${newPath}page=${pageNum}`);
	};

	useEffect(() => {
		page ? setPageData(page) : null;

		return pageData;
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

	return componentReady ? (
		<div tw="bg-white px-4 mb-4 py-2 lg:flex items-center justify-between sm:px-6 align-middle">
			<div tw="flex items-center mb-8 lg:m-0">
				<div tw="mt-2 lg:my-0">
					<p tw="text-center lg:text-left text-sm leading-5 text-gray-700">
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
				className="flex"
				current={currentPage}
				defaultCurrent={currentPage}
				defaultPageSize={values[0]}
				disabled={!componentReady}
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
		<PaginationSkeleton />
	);
};

DataPagination.propTypes = {
	activePage: PropTypes.number,
	apiEndpoint: PropTypes.string,
	componentReady: PropTypes.bool,
	handleItemsPerPageChange: PropTypes.func,
	linksPerPage: PropTypes.number,
	pathName: PropTypes.string
};

DataPagination.defaultProps = {
	activePage: null,
	apiEndpoint: null,
	componentReady: false,
	handleItemsPerPageChange: null,
	linksPerPage: null,
	pathName: null
};

export default DataPagination;
