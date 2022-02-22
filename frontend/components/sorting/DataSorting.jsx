import { MemoizedSorting } from "@components/sorting/common/Sorting";
import { orderingByNameQuery } from "@constants/GlobalValues";
import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleRemoveUrlParameter } from "@helpers/handleRemoveUrlParameter";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { handleConversionStringToCamelCase, handleConversionStringToLowercase } from "@utils/convertCase";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useState } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

const initialOrder = {
	siteName: "asc"
};

/**
 * Custom function to render the `DataSorting` common component
 *
 * @param {string} slug
 * @param {array} labels
 */
const DataSorting = ({ slug = null, labels = null }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	// Router
	const { query, asPath, push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	const { linksPerPage, setPagePath } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);

	// Handle sort
	const handleSort = async (slug, dir) => {
		setSortOrder({ ...initialOrder });

		// Remove `ordering` URL parameter
		let newPath = handleRemoveUrlParameter(asPath, "ordering");

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

		// Push new path
		push(newPath);

		// Mutate function here
		mutate(scanApiEndpoint);
	};

	return slug ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<MemoizedSorting
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					tableContent={labels}
					ordering={query?.ordering ?? null}
					handleSort={handleSort}
					slug={slug}
				/>
			</div>
		</div>
	) : null;
};

DataSorting.propTypes = {
	labels: PropTypes.array,
	slug: PropTypes.string
};

export const MemoizedDataSorting = memo(DataSorting);
