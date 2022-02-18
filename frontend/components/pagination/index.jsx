import { MemoizedPaginationSkeleton } from "@components/skeletons/PaginationSkeleton";
import { MaxSitesPerPage, MaxTotalSitesLimit } from "@constants/GlobalValues";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { usePage } from "@hooks/usePage";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import Pagination from "rc-pagination";
import { memo, useContext } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

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
	const { user } = useUser();
	const { pageCount } = usePage(scanApiEndpoint);

	// Custom variables
	const currentPage = query?.page ? parseInt(query.page) : 1;
	const offset = (currentPage - 1) * linksPerPage;
	const linkNumbers = [];
	const pageNumbers = [];
	const linksPerPageOptions = [];

	// Translations
	const { t } = useTranslation();
	const showingText = t("common:showing");
	const toText = t("common:to");
	const ofText = t("common:of");
	const nextText = t("common:next");
	const previousText = t("common:previous");
	const resultsText = t("common:results");
	const rowsPerPageText = t("common:rowsPerPage");

	// Set `totalPages` value
	const totalPages = Math.ceil(pageCount / linksPerPage) || 0;

	// If `totalPages` is less than 1, hide pagination component
	if (totalPages < 1) return null;

	// Set updated `pageNumbers` for `linksPerPage` prop
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}

	// Set updated `linksPerPageOptions` for `linksPerPage` prop
	if (MaxSitesPerPage <= pageCount) {
		let i = MaxSitesPerPage;

		while (i <= pageCount) {
			linksPerPageOptions.push(i);
			i += MaxSitesPerPage;
		}
	} else {
		let i = MaxTotalSitesLimit;

		while (i >= pageCount) {
			linksPerPageOptions.push(pageCount);
			i += MaxTotalSitesLimit;
		}
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
	const handleRowsPerPageChange = async (e) => {
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

			await mutate(scanApiEndpoint);
			push(newPath);
		}
	};

	return isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
		<div tw="bg-white mt-8 mb-4 py-4 lg:flex items-center justify-between align-middle">
			<div tw="flex items-center mb-8 lg:m-0">
				<div tw="mt-2 lg:my-0">
					<p tw="text-center lg:text-left text-sm leading-5 text-gray-500">
						{showingText}
						<span tw="px-1 font-medium">{paginatedItems[0] || 0}</span>
						{toText}
						<span tw="px-1 font-medium">{paginatedItems[paginatedItems.length - 1] || 0}</span>
						{ofText}
						<span tw="px-1 font-medium">{pageCount || 0}</span>
						{resultsText}
					</p>
				</div>
			</div>

			<Pagination
				className="pagination"
				current={currentPage}
				defaultCurrent={currentPage}
				defaultPageSize={pageNumbers[0]}
				disabled={!isComponentReady && user && Math.round(user?.status / 100) === 4 && user?.data?.detail}
				onChange={handlePageChange}
				pageSize={linksPerPage}
				showLessItems
				showPrevNextJumpers
				total={totalPages * linksPerPage}
				prevIcon={previousText}
				nextIcon={nextText}
			/>

			<div tw="flex items-center mt-4 lg:m-0">
				<h1 tw="-mt-px pr-4 inline-flex items-center text-sm leading-5 font-normal text-gray-500">{rowsPerPageText}</h1>
				<div>
					<select
						onChange={handleRowsPerPageChange}
						value={linksPerPage}
						tw="block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md sm:leading-5"
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
	) : (
		<MemoizedPaginationSkeleton />
	);
};

export const MemoizedDataPagination = memo(DataPagination);
