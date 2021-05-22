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
	imageUrl: "default",
	imageSize: "default",
	status: "default",
	httpCode: "default",
	missingAlts: "default",
	occurrences: "default"
};

const ImageSorting = ({ result, slug, mutateImages, imageTableContent, setPagePath }) => {
	const [sortOrder, setSortOrder] = React.useState(initialOrder);

	const { asPath } = useRouter();
	const router = useRouter();

	const handleSort = (slug, dir) => {
		setSortOrder({ ...initialOrder });

		let newPath = removeURLParameter(asPath, "ordering");

		const sortItem = slugToCamelcase(slug);
		const sortKey = getSortKeyFromSlug(imageTableContent, slug);

		setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));

		if (dir == "asc") {
			if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
			else newPath += `?ordering=${sortKey}`;
		} else {
			if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
			else newPath += `?ordering=-${sortKey}`;
		}

		if (newPath.includes("?")) setPagePath(`${removeURLParameter(newPath, "page")}&`);
		else setPagePath(`${removeURLParameter(newPath, "page")}?`);

		router.push(newPath);
		mutateImages;
	};

	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "image-url" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.imageUrl}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "image-size" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.imageSize}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "status" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.status}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "http-code" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.httpCode}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "missing-alts" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.missingAlts}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : slug == "occurrences" ? (
						<Sorting
							setSortOrder={setSortOrder}
							tableContent={imageTableContent}
							ordering={result.ordering}
							direction={sortOrder.occurrences}
							onSortHandler={handleSort}
							slug={slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	);
};

ImageSorting.propTypes = {};

export default ImageSorting;
