import { MemoizedPaginationSkeleton } from "@components/skeletons/PaginationSkeleton";
import { MaxSitesSize } from "@constants/GlobalValues";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useAlertMessage } from "@hooks/useAlertMessage";
import { useLoading } from "@hooks/useLoading";
import { usePage } from "@hooks/usePage";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Pagination from "rc-pagination";
import { memo, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
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
 */
const DataPagination = () => {
	const [activePage, setActivePage] = useState(null);
	const [pageData, setPageData] = useState(null);

	// Router
	const { asPath, query } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks

	const { linksPerPage, setLinksPerPage, pagePath, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);
	const { isComponentReady } = useLoading();
	const { state, setConfig } = useAlertMessage();

	// SWR hooks
	const { page, errorPage, validatingPage } = usePage(scanApiEndpoint);

	// Custom variables
	const currentPage = activePage ?? 1;
	const offset = (currentPage - 1) * linksPerPage;
	const linkNumbers = [];
	const pageNumbers = [];
	const maxSites = MaxSitesSize;

	// Set updated `pageNumbers` for `linksPerPage` prop
	for (let i = 0; i <= maxSites; i += linksPerPage) {
		pageNumbers.push(i);
	}

	// Translations
	const { t } = useTranslation();
	const showingText = t("common:showing");
	const toText = t("common:to");
	const ofText = t("common:of");
	const nextText = t("common:next");
	const previousText = t("common:previous");
	const resultsText = t("common:results");
	const rowsPerPageText = t("common:rowsPerPage");

	// TODO: Error handling for `page` SWR hook
	useMemo(() => {
		typeof errorPage !== "undefined" && errorPage !== null
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
		(async () => {
			if (!isMounted) return;

			if (!validatingPage) {
				const pageData = await page?.data;

				if (typeof pageData !== "undefined" && pageData !== null) {
					setPageData(page.data);
				}
			}

			return pageData;
		})();

		return () => {
			isMounted = false;
		};
	}, [page, validatingPage]);

	// Set `pageCount` value
	const pageCount = pageData?.count ?? null;

	// Populate `linkNumbers` array based on `pageCount`
	if (pageCount !== null) {
		for (let i = 1; i <= pageCount; i++) {
			linkNumbers.push(i);
		}
	}

	// Set `totalPages` value
	const totalPages = pageCount !== null && linksPerPage !== null ? Math.ceil(pageCount / linksPerPage) : null;

	if (totalPages !== null && totalPages < 1) return null;

	const paginatedItems = linksPerPage !== null ? linkNumbers.slice(offset).slice(0, linksPerPage) : null;

	// Handle page change
	const handlePageChange = (pageNum) => {
		const newPath = handleRemoveUrlParameter(pagePath, "page");

		router.push(`${newPath}page=${pageNum}`);
	};

	// Handle table rows per page change
	const handleRowsPerPageChange = async ({ count }) => {
		const countValue = await parseInt(count.target.value);

		let newPath = asPath;
		newPath = handleRemoveUrlParameter(newPath, "page");

		// Update pagination links per page
		if (countValue) {
			if (newPath.includes("per_page")) {
				newPath = handleRemoveUrlParameter(newPath, "per_page");
			}

			if (newPath.includes("?")) {
				newPath += `&per_page=${countValue}`;
				setPagePath(`${newPath}&`);
			} else {
				newPath += `?per_page=${countValue}`;
				setPagePath(`${newPath}?`);
			}

			setLinksPerPage(countValue);

			await mutate(scanApiEndpoint, false);

			router.push(newPath);
		}
	};

	return isComponentReady ? (
		<div tw="bg-white mt-8 mb-4 py-2 lg:flex items-center justify-between align-middle">
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
				defaultPageSize={pageNumbers[0]}
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
						onChange={handleRowsPerPageChange}
						value={linksPerPage}
						tw="block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md sm:leading-5"
					>
						{pageNumbers.map((val, key) => {
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
	apiEndpoint: PropTypes.string
};

export const MemoizedDataPagination = memo(DataPagination);
