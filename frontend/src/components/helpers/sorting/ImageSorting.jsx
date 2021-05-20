// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/helpers/sorting/Sorting"));

const ImageSorting = ({ sortOrder, onSortHandler, slug }) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{slug == "image-url" ? (
						<Sorting enabled={true} direction={sortOrder.imageUrl} onSortHandler={onSortHandler} slug={slug} />
					) : slug == "image-size" ? (
						<Sorting enabled={true} direction={sortOrder.imageSize} onSortHandler={onSortHandler} slug={slug} />
					) : slug == "status" ? (
						<Sorting enabled={true} direction={sortOrder.status} onSortHandler={onSortHandler} slug={slug} />
					) : slug == "http-code" ? (
						<Sorting enabled={true} direction={sortOrder.httpCode} onSortHandler={onSortHandler} slug={slug} />
					) : slug == "missing-alts" ? (
						<Sorting enabled={true} direction={sortOrder.missingAlts} onSortHandler={onSortHandler} slug={slug} />
					) : slug == "occurrences" ? (
						<Sorting enabled={true} direction={sortOrder.occurrences} onSortHandler={onSortHandler} slug={slug} />
					) : null}
				</span>
			</div>
		</div>
	);
};

ImageSorting.propTypes = {};

export default ImageSorting;
