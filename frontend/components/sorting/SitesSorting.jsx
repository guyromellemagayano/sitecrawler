import { MemoizedSorting } from "@components/sorting/common/Sorting";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { handleConversionStringToCamelCase, handleConversionStringToLowercase } from "@utils/convertCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useState } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

const initialOrder = {
	siteName: "asc"
};

/**
 * Custom function to render the `SitesSorting` common component
 *
 * @param {string} slug
 * @param {array} labels
 * @param {function} setPagePath
 */
export const SitesSorting = ({ slug = null, labels = null, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Router
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Handle sort
	const handleSort = async (slug, dir) => {
		setSortOrder({ ...initialOrder });

		// Remove `ordering` URL parameter
		let newPath = handleRemoveUrlParameter(router.asPath, "ordering");

		// Handle slug to camelcase
		const sortItem = handleConversionStringToCamelCase(slug);

		// Handle sorting from given slug
		const sortKey = handleGetSortKeyFromSlug(labels, slug);

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
		await mutate(SitesApiEndpoint, false);

		// Push new path
		return router.push(newPath);
	};

	return slug !== null ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{slug === "site-name" ? (
					<MemoizedSorting
						sortOrder={sortOrder}
						setSortOrder={setSortOrder}
						tableContent={labels}
						ordering={router.query?.ordering ?? null}
						handleSort={handleSort}
						slug={slug}
					/>
				) : null}
			</div>
		</div>
	) : null;
};

SitesSorting.propTypes = {
	labels: PropTypes.array,
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};
