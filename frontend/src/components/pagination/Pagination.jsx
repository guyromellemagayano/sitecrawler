// React
import * as React from "react";

// NextJS
import Router, { useRouter } from "next/router";

// External
import "twin.macro";
import loadable from "@loadable/component";
import Pagination from "rc-pagination";
import PropTypes from "prop-types";

// Hooks
import usePage from "src/hooks/usePage";

// Helpers
import { removeURLParameter } from "src/helpers/functions";

// Components
const PaginationSkeleton = loadable(() => import("src/components/skeletons/PaginationSkeleton"));

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

const MyPagination = (props) => {
	const [paginationLoaded, setPaginationLoaded] = React.useState(false);
	const [pageData, setPageData] = React.useState([]);

	const currentPage = parseInt(props.page) || 1;
	const linkNumbers = [];
	const offset = (currentPage - 1) * props.linksPerPage;
	const pageNumbers = [];
	const values = [20, 25, 50, 100];

	const router = useRouter();

	const { page: page, pageError: pageError } = usePage({
		endpoint: props.apiEndpoint
	});

	const handlePageChange = (pageNum) => {
		const newPath = removeURLParameter(props.pathName, "page");

		router.push(`${newPath}page=${pageNum}`);
	};

	React.useEffect(() => {
		if (page && page !== undefined && Object.keys(page).length > 0) {
			setTimeout(() => {
				setPaginationLoaded(true);
			}, 500);

			setPageData(page);
		}

		return setPaginationLoaded(false);
	}, [page]);

	const totalPages = Math.ceil(pageData.count / props.linksPerPage);

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	if (totalPages < 1) return null;

	for (let i = 1; i <= pageData.count; i++) {
		linkNumbers.push(i);
	}

	const paginatedItems = linkNumbers.slice(offset).slice(0, props.linksPerPage);

	return paginationLoaded ? (
		<div tw="bg-white px-4 mb-4 py-2 lg:flex items-center justify-between sm:px-6 align-middle">
			<div tw="flex items-center mb-8 lg:m-0">
				<div tw="mt-2 lg:my-0">
					<p tw="text-center lg:text-left text-sm leading-5 text-gray-700">
						Showing
						<span tw="px-1 font-medium">{paginatedItems[0] || 0}</span>
						to
						<span tw="px-1 font-medium">{paginatedItems[paginatedItems.length - 1] || 0}</span>
						of
						<span tw="px-1 font-medium">
							{page && page !== undefined && Object.keys(page).length > 0 && page.count}
						</span>
						results
					</p>
				</div>
			</div>

			<Pagination
				showPrevNextJumpers={true}
				defaultPageSize={20}
				pageSize={props.linksPerPage}
				defaultCurrent={currentPage}
				current={currentPage}
				total={totalPages * props.linksPerPage}
				className="flex"
				onChange={handlePageChange}
				locale={PaginationLocale}
				prevIcon="Previous"
				nextIcon="Next"
			/>

			<div tw="flex items-center mt-4 lg:m-0">
				<h1 tw="-mt-px pr-4 inline-flex items-center text-sm leading-5 font-normal text-gray-500">Rows per page</h1>
				<div>
					<select
						onChange={props.onItemsPerPageChange}
						value={props.linksPerPage}
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

MyPagination.propTypes = {};

export default MyPagination;
