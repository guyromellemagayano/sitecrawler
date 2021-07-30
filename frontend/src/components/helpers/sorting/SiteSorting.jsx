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
	siteName: "asc",
	crawlStatus: "default",
	lastCrawled: "default",
	totalIssues: "default"
};

const SiteSorting = ({ result, slug, mutateSite, sitesTableLabels, setPagePath }) => {
	const [sortOrder, setSortOrder] = React.useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(sitesTableLabels, slug);

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
		mutateSite;
	};

	return slug !== undefined ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{slug === "site-name" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={sitesTableLabels}
						ordering={result.ordering}
						direction={sortOrder.siteName}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug === "crawl-status" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={sitesTableLabels}
						ordering={result.ordering}
						direction={sortOrder.crawlStatus}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : slug === "last-crawled" ? (
					<Sorting
						setSortOrder={setSortOrder}
						tableContent={sitesTableLabels}
						ordering={result.ordering}
						direction={sortOrder.lastCrawled}
						onSortHandler={handleSort}
						slug={slug}
					/>
				) : null}
			</div>
		</div>
	) : null;
};

SiteSorting.propTypes = {};

export default SiteSorting;
