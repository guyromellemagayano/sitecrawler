// React
import { useState } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import Sorting from "./common/Sorting";

// Utils
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug } from "@utils/functions";

const initialOrder = {
	pageUrl: "default",
	createdAt: "default",
	totalLinks: "default",
	totalOkLinks: "default",
	totalNonOkLinks: "default"
};

const SeoSorting = ({ result, slug, mutatePages, labels, setPagePath }) => {
	const [sortOrder, setSortOrder] = useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(labels, slug);

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

	return slug !== undefined ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "page-url" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result.ordering}
							direction={sortOrder.pageUrl}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "created-at" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result.ordering}
							direction={sortOrder.createdAt}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result.ordering}
							direction={sortOrder.totalLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-ok-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result.ordering}
							direction={sortOrder.totalOkLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "total-non-ok-links" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={labels}
							ordering={result.ordering}
							direction={sortOrder.totalNonOkLinks}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

SeoSorting.propTypes = {
	labels: PropTypes.array,
	mutateLinks: PropTypes.func,
	ordering: PropTypes.string,
	setPagePath: PropTypes.func,
	slug: PropTypes.string
};

SeoSorting.defaultProps = {
	labels: null,
	mutateLinks: null,
	ordering: null,
	setPagePath: null,
	slug: null
};

export default SeoSorting;
