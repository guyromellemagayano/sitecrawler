import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleConversionStringToCamelCase, handleConversionStringToLowercase } from "@utils/convertCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
// import { useSWRConfig } from "swr";
import "twin.macro";
import { MemoizedSorting } from "./common/Sorting";

const initialOrder = {
	pageLargePages: "default",
	pageBrokenSecurity: "default"
};

/**
 * Custom function to render the `PageSorting` common component
 *
 * @param {object} result
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
const PageSorting = ({ result = null, slug = null, labels = null, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Router
	const { asPath, push } = useRouter();

	// SWR hook for global mutations
	// const { mutate } = useSWRConfig();

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
			// mutate(linksEndpoint, false)

			push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		handleSort();
	}, [handleSort]);

	return slug !== null && (slug === "page-url" || slug === "page-size" || slug === "page-ssl") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug === "page-url" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.pageUrl ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "page-size" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.pageSize ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "page-ssl" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.pageSsl ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

PageSorting.propTypes = {
	labels: PropTypes.array,
	result: PropTypes.shape({
		ordering: PropTypes.string
	}),
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};

/**
 * Memoized custom `PageSorting` component
 */
export const MemoizedPageSorting = memo(PageSorting);
