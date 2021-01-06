// React
import React from 'react';

// NextJS
import Router from 'next/router';

// External
import 'core-js';
import Pagination from 'rc-pagination';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

// Helpers
import { removeURLParameter } from 'src/helpers/functions';

const PaginationDiv = styled.nav`
.rc-pagination li {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  --text-opacity: 1;
  color: #a0aec0;
  color: rgba(160, 174, 192, var(--text-opacity));
  outline: none;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-top: -1rem;
  padding-top: 1rem;
  font-weight: 500;
}
.rc-pagination li:hover {
  color: rgba(74, 85, 104, var(--text-opacity));
}
.rc-pagination-item {
  width: 40px;
  height: 40px;
}
.rc-pagination-item-active {
  border-top: 2px solid #667eea;
  color: #667eea !important;
}
.rc-pagination-item a {
  outline: none;
}
.rc-pagination-jump-next button:before, .rc-pagination-jump-prev button:before {
  content: '...';
  display: block;
}
.rc-pagination-prev {
  margin-right: 0.75rem;
}
.rc-pagination-prev button:before {
  content: 'Previous',
  display: block;
}
.rc-pagination-next {
  margin-left: 0.75rem;
}
`;

const PaginationLocale = {
	items_per_page: 'Rows per Page',
	jump_to: 'Goto',
	jump_to_confirm: 'Goto',
	page: 'Page',

	// Pagination.jsx
	prev_page: 'Previous',
	next_page: 'Next',
	prev_5: 'Prev 5',
	next_5: 'Next 5',
	prev_3: 'Prev 3',
	next_3: 'Next 3'
};

const MyPagination = ({
	href,
	pathName,
	apiEndpoint,
	page,
	linksPerPage,
	onItemsPerPageChange
}) => {
	const pageNumbers = [];
	const values = [20, 25, 50, 100];
	const currentPage = parseInt(page) || 1;
	const linkNumbers = [];
	const offset = (currentPage - 1) * linksPerPage;

	const { data: pages } = useSWR(apiEndpoint, useFetcher);

	// console.log(pathName);

	const handlePageChange = (pageNum) => {
		// console.log('[pageNum]', pageNum);
		const newPath = removeURLParameter(pathName, 'page');
		Router.push(`${newPath}page=${pageNum}`);
	};

	const totalPages = Math.ceil(page.count / linksPerPage);

	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	if (totalPages < 1) return null;

	for (let i = 1; i <= page.count; i++) {
		linkNumbers.push(i);
	}

	const paginatedItems = linkNumbers.slice(offset).slice(0, linksPerPage);

	return pages ? (
		<PaginationDiv className="bg-white px-4 mb-4 py-2 lg:flex items-center justify-between sm:px-6 align-middle shadow-xs rounded-lg">
			<div className="flex items-center mb-8 lg:m-0">
				<div className="mt-2 lg:my-0">
					<p className="text-center lg:text-left text-sm leading-5 text-gray-700">
						Showing
						<span className="px-1 font-medium">{paginatedItems[0]}</span>
						to
						<span className="px-1 font-medium">
							{paginatedItems[paginatedItems.length - 1]}
						</span>
						of
						<span className="px-1 font-medium">{page.count}</span>
						results
					</p>
				</div>
			</div>

			<Pagination
				showPrevNextJumpers={true}
				defaultPageSize={20}
				pageSize={linksPerPage}
				defaultCurrent={currentPage}
				current={currentPage}
				total={totalPages * linksPerPage}
				className="flex"
				onChange={handlePageChange}
				locale={PaginationLocale}
				prevIcon="Previous"
				nextIcon="Next"
			/>

			<div className="flex items-center mt-4 lg:m-0">
				<h1 className="-mt-px pr-4 inline-flex items-center text-sm leading-5 font-normal text-gray-500">
					Rows per page
				</h1>
				<div>
					<select
						onChange={onItemsPerPageChange}
						value={linksPerPage}
						className="form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
					>
						{values.map((val, key) => {
							return (
								<option key={key} value={val}>
									{val === 20 ? '--' : val}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		</PaginationDiv>
	) : (
		<PaginationDiv className="bg-white px-4 py-4 flex items-start justify-between sm:px-6 align-middle shadow-xs rounded-lg">
			<div className="w-0 flex-1 flex">
				<Skeleton duration={2} width={120} />
			</div>
			<div className="hidden md:flex">
				<Skeleton duration={2} width={280} />
			</div>
			<div className="w-0 flex-1 flex justify-end">
				<Skeleton duration={2} width={120} />
			</div>
		</PaginationDiv>
	);
};

MyPagination.propTypes = {
	href: PropTypes.string,
	pathName: PropTypes.string,
	apiEndpoint: PropTypes.string,
	page: PropTypes.number,
	linksPerPage: PropTypes.number,
	onItemsPerPageChange: PropTypes.func
};

export default MyPagination;
