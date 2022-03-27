import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import {
	ArrowNarrowLeftIcon,
	ArrowNarrowRightIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon
} from "@heroicons/react/solid";
import { usePage } from "@hooks/usePage";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSWRConfig } from "swr";

// Locales
const PaginationLocale = {
	prev_page: "Previous Page",
	next_page: "Next Page",
	prev_5: "Previous 5 Pages",
	next_5: "Next 5 Pages"
};

/**
 * Custom function to render the `Pagination` component
 */
const DataPagination = () => {
	// Router
	const { asPath, query, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { linksPerPage, setLinksPerPage, pagePath, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { pageCount, pageResults } = usePage(scanApiEndpoint);

	// Custom variables
	const currentPage = query?.page ? parseInt(query.page) : 1;
	const offset = (currentPage - 1) * linksPerPage;
	const linkNumbers = [];
	const pageNumbers = [];
	const linksPerPageOptions = [25, 50, 75, 100];

	// Translations
	const { t } = useTranslation();
	const showingText = t("common:showing");
	const toText = t("common:to");
	const ofText = t("common:of");
	const resultsText = t("common:results");
	const rowsPerPageText = t("common:rowsPerPage");
	const nextText = t("common:next");
	const previousText = t("common:previous");

	// Set `totalPages` value
	const totalPages = Math.ceil(pageCount / linksPerPage) || 0;

	// If `totalPages` is less than 2, hide pagination component
	if (totalPages < 1) return null;

	// Set updated `pageNumbers` for `linksPerPage` prop
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	// Set `linkNumbers` array based on the `pageCount`
	for (let i = 1; i <= pageCount; i++) {
		linkNumbers.push(i);
	}

	// Set paginated items
	const paginatedItems = linkNumbers.slice(offset).slice(0, linksPerPage);

	// Handle page change
	const handlePageChange = (pageNum) => {
		const newPath = handleRemoveUrlParameter(pagePath, "page");

		push(`${newPath}page=${pageNum}`);
	};

	// Handle table rows per page change
	const handleRowsPerPageChange = (e) => {
		e.preventDefault();

		const countValue = parseInt(e.target.value);

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "page");

		// Update pagination links per page
		if (countValue) {
			if (newPath.includes("per_page")) {
				newPath = handleRemoveUrlParameter(newPath, "per_page");
			}

			if (newPath.includes("?")) newPath += `&per_page=${countValue}`;
			else newPath += `?per_page=${countValue}`;

			setLinksPerPage(countValue);

			if (newPath.includes("?")) setPagePath(`${newPath}&`);
			else setPagePath(`${newPath}?`);
		}

		// Push new path
		push(newPath);

		// Mutate function here
		mutate(scanApiEndpoint, null, { rollbackOnError: true, revalidate: true });
	};

	// Custom navigation item renders
	const navigationItemRender = (current, type, element) => {
		if (type === "prev") {
			return (
				<div className="flex items-center justify-center space-x-3">
					<ArrowNarrowLeftIcon className="h-4 w-4 font-semibold text-gray-400" aria-hidden="true" />
					<span className="text-sm font-semibold text-gray-500 hover:text-gray-700">{previousText}</span>
				</div>
			);
		}

		if (type === "next") {
			return (
				<div className="flex items-center justify-center space-x-3">
					<span className="text-sm font-semibold text-gray-500 hover:text-gray-700">{nextText}</span>
					<ArrowNarrowRightIcon className="h-4 w-4 font-semibold text-gray-400" aria-hidden="true" />
				</div>
			);
		}

		if (type === "jump-prev") {
			return (
				<div className="flex items-center justify-center space-x-3">
					<ChevronDoubleLeftIcon
						className="mx-2 h-4 w-4 text-sm text-gray-400 hover:text-gray-700"
						aria-hidden="true"
					/>
				</div>
			);
		}

		if (type === "jump-next") {
			return (
				<div className="flex items-center justify-center space-x-3">
					<ChevronDoubleRightIcon
						className="mx-2 h-4 w-4 text-sm text-gray-400  hover:text-gray-700"
						aria-hidden="true"
					/>
				</div>
			);
		}

		return element;
	};

	return isComponentReady && pageCount > 0 && pageResults?.length > 0 ? (
		<div className="mt-8 mb-4 items-center justify-between py-4 align-middle lg:flex">
			<div className="mb-8 flex items-center lg:m-0">
				<div className="mt-2 lg:my-0">
					<p className="text-center text-sm leading-5 text-gray-500 lg:text-left">
						{showingText}
						<span className="px-1 font-medium">{paginatedItems[0] || 0}</span>
						{toText}
						<span className="px-1 font-medium">{paginatedItems[paginatedItems.length - 1] || 0}</span>
						{ofText}
						<span className="px-1 font-medium">{pageCount || 0}</span>
						{resultsText}
					</p>
				</div>
			</div>

			<Pagination
				showPrevNextJumpers={true}
				current={currentPage}
				defaultCurrent={currentPage}
				defaultPageSize={pageNumbers[0]}
				disabled={!isComponentReady}
				onChange={handlePageChange}
				pageSize={linksPerPage}
				locale={PaginationLocale}
				total={totalPages * linksPerPage}
				pageSizeOptions={linksPerPageOptions}
				itemRender={navigationItemRender}
			/>

			<div className="mt-4 flex items-center lg:m-0">
				<h1 className="-mt-px inline-flex items-center pr-4 text-sm font-normal leading-5 text-gray-500">
					{rowsPerPageText}
				</h1>
				<div>
					<select
						onChange={handleRowsPerPageChange}
						value={linksPerPage}
						className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base leading-6 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm sm:leading-5"
					>
						{linksPerPageOptions.map((val, key) => {
							return (
								<option key={key} value={val}>
									{val}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		</div>
	) : isComponentReady && pageCount === 0 && pageResults?.length === 0 ? null : (
		<div className="mt-8 mb-4 items-center justify-between  py-4 align-middle lg:flex">
			<div className="flex flex-1">
				<Skeleton duration={2} width={120} />
			</div>
			<div className="space-x-3 md:flex">
				<Skeleton duration={2} width={80} />
				<div className="space-x-3 md:flex">
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
					<Skeleton duration={2} width={40} />
				</div>
				<Skeleton duration={2} width={80} />
			</div>
			<div className="flex flex-1 justify-end">
				<Skeleton duration={2} width={120} />
			</div>
		</div>
	);
};

DataPagination.propTypes = {
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isOther: PropTypes.bool,
	isPages: PropTypes.bool,
	isSites: PropTypes.bool
};

export const MemoizedDataPagination = memo(DataPagination);
