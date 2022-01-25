import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleSlugToCamelCase } from "@helpers/handleSlugToCamelcase";
import { handleStringToLowerCase } from "@helpers/handleStringToCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
// import { useSWRConfig } from "swr";
import "twin.macro";
import { MemoizedSorting } from "./common/Sorting";

const initialOrder = {
	linkUrl: "default",
	urlType: "default",
	status: "default",
	httpCode: "default",
	linkLocation: "default",
	occurrences: "default"
};

/**
 * Custom function to render the `LinkSorting` common component
 *
 * @param {object} result
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
const LinkSorting = ({ result = null, slug = null, labels = null, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

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
			// mutate(linksEndpoint, false)

			router.push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSort();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSort]);

	return slug !== null &&
		(slug === "link-url" ||
			slug === "url-type" ||
			slug === "status" ||
			slug === "http-code" ||
			slug === "occurrences") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug === "link-url" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.linkUrl ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "url-type" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.urlType ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "status" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.status ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "http-code" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.httpCode ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "occurrences" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.occurrences ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

LinkSorting.propTypes = {
	labels: PropTypes.array,
	result: PropTypes.shape({
		ordering: PropTypes.string
	}),
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};

/**
 * Memoized custom `LinkSorting` component
 */
export const MemoizedLinkSorting = memo(LinkSorting);
