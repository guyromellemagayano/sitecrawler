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
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug } from "src/helpers/functions";

const initialOrder = {
	pageUrl: "default",
	createdAt: "default",
	totalLinks: "default",
	totalOkLinks: "default",
	totalNonOkLinks: "default"
};

const SeoSorting = ({ result, slug, mutatePages, seoTableContent, setPagePath }) => {
	const [sortOrder, setSortOrder] = React.useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(seoTableContent, slug);

		if (sortOrder[sortItem] == "default") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));
			if (dir == "asc") {
				if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
				else newPath += `?ordering=${sortKey}`;
			} else {
				if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
				else newPath += `?ordering=-${sortKey}`;
			}
		} else if (sortOrder[sortItem] == "asc") {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "desc" }));
			if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		} else {
			setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }));
			if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		}

		// console.log('[pagePath]', newPath)
		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		router.push(newPath);
		mutatePages;
	};

	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "page-url" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={seoTableContent}
							ordering={result.ordering}
							direction={sortOrder.pageUrl}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "created-at" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={seoTableContent}
							ordering={result.ordering}
							direction={sortOrder.createdAt}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={seoTableContent}
							ordering={result.ordering}
							direction={sortOrder.totalLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-ok-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={seoTableContent}
							ordering={result.ordering}
							direction={sortOrder.totalOkLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-non-ok-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={seoTableContent}
							ordering={result.ordering}
							direction={sortOrder.totalNonOkLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	);
};

SeoSorting.propTypes = {};

export default SeoSorting;
