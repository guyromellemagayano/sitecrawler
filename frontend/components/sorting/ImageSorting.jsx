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
	imageUrl: "default",
	imageSize: "default",
	status: "default",
	httpCode: "default",
	missingAlts: "default",
	occurrences: "default"
};

/**
 * Custom function to render the `ImageSorting` common component
 *
 * @param {object} result
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
const ImageSorting = ({ result = null, slug = null, labels = null, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Router
	const { asPath } = useRouter();
	const router = useRouter();

	// SWR hook for global mutations
	// const  { mutate } = useSWRConfig();

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
			// mutate(imagesEndpoint, false)

			router.push(newPath);
		},
		[asPath, labels]
	);

	useEffect(() => {
		handleSort();
	}, [handleSort]);

	return slug !== null &&
		(slug === "image-url" ||
			slug === "image-size" ||
			slug === "status" ||
			slug === "http-code" ||
			slug === "missing-alts" ||
			slug === "occurrences") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug === "image-url" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.imageUrl ?? null}
							handleSort={handleSort}
							slug={slug}
						/>
					) : slug === "image-size" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.imageSize ?? null}
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
					) : slug === "missing-alts" ? (
						<MemoizedSorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result?.ordering ?? null}
							direction={sortOrder?.missingAlts ?? null}
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

ImageSorting.propTypes = {
	labels: PropTypes.array,
	result: PropTypes.shape({
		ordering: PropTypes.string
	}),
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};

/**
 * Memoized custom `ImageSorting` component
 */
export const MemoizedImageSorting = memo(ImageSorting);
