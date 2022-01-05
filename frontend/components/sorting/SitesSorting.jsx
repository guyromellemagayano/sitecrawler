/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedSorting } from "@components/sorting/common/Sorting";
import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleSlugToCamelCase } from "@helpers/handleSlugToCamelcase";
import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
// import { useSWRConfig } from "swr";
import "twin.macro";

const initialOrder = {
	siteName: "asc",
	crawlStatus: "default",
	lastCrawled: "default",
	totalIssues: "default"
};

/**
 * Custom function to render the `SitesSorting` common component
 *
 * @param {object} result
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
export function SitesSorting(props) {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Props
	const { result, slug, labels, setPagePath } = props;

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	// const { mutate } = useSWRConfig();

	// Handle sort
	const handleSort = useCallback(
		async (slug, dir) => {
			setSortOrder({ ...initialOrder });

			// Remove `ordering` URL parameter
			let newPath = handleRemoveUrlParameter(asPath, "ordering");

			// Handle slug to camelcase
			const sortItem = handleSlugToCamelCase(slug);

			// Handle sorting from given slug
			const sortKey = handleGetSortKeyFromSlug(labels, slug);

			// Update `sortOrder` state
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));

			// Sanitize `ordering` values
			const sanitizedDir = handleStringToLowerCase(dir);

			if (sanitizedDir === "asc") {
				if (newPath.includes("?")) newPath += `&${orderingByNameQuery + sortKey}`;
				else newPath += `?${orderingByNameQuery + sortKey}`;
			} else if (sanitizedDir === "desc") {
				if (newPath.includes("?")) newPath += `&${orderingByNameQuery + "-" + sortKey}`;
				else newPath += `?${orderingByNameQuery + "-" + sortKey}`;
			} else {
				newPath = handleRemoveUrlParameter(newPath, "ordering");
			}

			if (newPath.includes("?")) setPagePath(`${handleRemoveUrlParameter(newPath, "page")}&`);
			else setPagePath(`${handleRemoveUrlParameter(newPath, "page")}?`);

			// Mutate function here
			// mutate(sitesEndpoint, false)

			router.push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		handleSort();
	}, [handleSort]);

	return typeof slug !== undefined &&
		slug !== null &&
		(slug === "site-name" || slug === "crawl-status" || slug === "last-crawled") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{slug === "site-name" ? (
					<MemoizedSorting
						setSortOrder={setSortOrder}
						tableContent={labels}
						ordering={result?.ordering ?? null}
						direction={sortOrder?.siteName ?? null}
						handleSort={handleSort}
						slug={slug}
					/>
				) : slug === "crawl-status" ? (
					<MemoizedSorting
						setSortOrder={setSortOrder}
						tableContent={labels}
						ordering={result?.ordering ?? null}
						direction={sortOrder?.crawlStatus ?? null}
						handleSort={handleSort}
						slug={slug}
					/>
				) : slug === "last-crawled" ? (
					<MemoizedSorting
						setSortOrder={setSortOrder}
						tableContent={labels}
						ordering={result?.ordering ?? null}
						direction={sortOrder?.lastCrawled ?? null}
						handleSort={handleSort}
						slug={slug}
					/>
				) : null}
			</div>
		</div>
	) : null;
}

/**
 * Memoized custom `SitesSorting` component
 */
export const MemoizedSitesSorting = memo(SitesSorting);
