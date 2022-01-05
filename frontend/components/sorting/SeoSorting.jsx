/* eslint-disable react-hooks/exhaustive-deps */
import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleSlugToCamelCase } from "@helpers/handleSlugToCamelcase";
import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import "twin.macro";
// import { useSWRConfig } from "swr";
import { MemoizedSorting } from "./common/Sorting";

const initialOrder = {
	pageUrl: "default",
	createdAt: "default",
	totalLinks: "default",
	totalOkLinks: "default",
	totalNonOkLinks: "default"
};

/**
 * Custom function to render the `SeoSorting` common component
 *
 * @param {object} result
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
export function SeoSorting(props) {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Props
	const { result = null, slug = null, labels = null, setPagePath } = props;

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
			const sortKey = handleGetSortKeyFromSlug(labels ?? null, slug);

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
			// mutate(seoEndpoint, false)

			router.push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		handleSort();
	}, [handleSort]);

	return typeof slug !== undefined &&
		slug !== null &&
		(slug === "page-url" ||
			slug === "created-at" ||
			slug === "total-links" ||
			slug === "total-ok-links" ||
			slug === "total-non-ok-links") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "page-url" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.pageUrl ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug == "created-at" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.createdAt ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug == "total-links" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.totalLinks ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug == "total-ok-links" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.totalOkLinks ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug == "total-non-ok-links" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.totalNonOkLinks ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
}

SeoSorting.propTypes = {
	labels: PropTypes.array,
	result: PropTypes.shape({
		ordering: PropTypes.string
	}),
	setPagePath: PropTypes.func.isRequired,
	slug: PropTypes.string
};

/**
 * Memoized custom `SeoSorting` component
 */
export const MemoizedSeoSorting = memo(SeoSorting);
