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
	linkUrl: "default",
	urlType: "default",
	status: "default",
	httpCode: "default",
	linkLocation: "default",
	occurrences: "default"
};

const LinkSorting = ({ result, slug, mutateLinks, linksTableLabels, setPagePath }) => {
	const [sortOrder, setSortOrder] = React.useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(linksTableLabels, slug);

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
		mutateLinks;
	};

	return slug !== undefined ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{slug == "link-url" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={linksTableLabels}
						ordering={result.ordering}
						direction={sortOrder.linkUrl}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug == "url-type" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={linksTableLabels}
						ordering={result.ordering}
						direction={sortOrder.urlType}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug == "status" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={linksTableLabels}
						ordering={result.ordering}
						direction={sortOrder.status}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug == "http-code" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={linksTableLabels}
						ordering={result.ordering}
						direction={sortOrder.httpCode}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug == "occurrences" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={linksTableLabels}
						ordering={result.ordering}
						direction={sortOrder.occurrences}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : null}
			</div>
		</div>
	) : null;
};

LinkSorting.propTypes = {};

export default LinkSorting;
