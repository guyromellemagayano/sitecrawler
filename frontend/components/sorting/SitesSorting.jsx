import { MemoizedSorting } from "@components/sorting/common/Sorting";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleConversionStringToCamelCase, handleConversionStringToLowercase } from "@utils/convertCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useSWRConfig } from "swr";
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
export const SitesSorting = ({ result = null, slug = null, labels = null, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle sort
	const handleSort = useCallback(
		async (slug, dir) => {
			setSortOrder({ ...initialOrder });

			// Remove `ordering` URL parameter
			let newPath = handleRemoveUrlParameter(asPath, "ordering");

			// Handle slug to camelcase
			const sortItem = handleConversionStringToCamelCase(slug);

			// Handle sorting from given slug
			const sortKey = handleGetSortKeyFromSlug(labels ?? null, slug);

			// Update `sortOrder` state
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));

			// Sanitize `ordering` values
			const sanitizedDir = handleConversionStringToLowercase(dir);

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
			mutate(SitesApiEndpoint, false);

			// Push new path
			router.push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		handleSort();
	}, [handleSort]);

	return slug !== null && (slug === "site-name" || slug === "crawl-status" || slug === "last-crawled") ? (
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
};

SitesSorting.propTypes = {
	labels: PropTypes.string,
	result: PropTypes.shape({
		ordering: PropTypes.string
	}),
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};
