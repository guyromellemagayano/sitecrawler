// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import Sorting from "src/components/helpers/sorting/Sorting";

// Helpers
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug } from "src/utils/functions";

const initialOrder = {
	pageLargePages: "default",
	pageBrokenSecurity: "default"
};

const PageSorting = ({ result, slug, mutatePages, pagesTableLabels, setPagePath }) => {
	const [sortOrder, setSortOrder] = React.useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(pagesTableLabels, slug);

		setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));

		if (dir == "asc") {
			if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		} else if (dir == "desc") {
			if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		} else {
			newPath = removeURLParameter(newPath, "ordering");
		}

		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		router.push(newPath);
		mutatePages;
	};

	return slug !== undefined ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "page-url" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={pagesTableLabels}
							ordering={result.ordering}
							direction={sortOrder.pageUrl}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "page-size" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={pagesTableLabels}
							ordering={result.ordering}
							direction={sortOrder.pageSize}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "page-ssl" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={pagesTableLabels}
							ordering={result.ordering}
							direction={sortOrder.pageSsl}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

PageSorting.propTypes = {};

export default PageSorting;
