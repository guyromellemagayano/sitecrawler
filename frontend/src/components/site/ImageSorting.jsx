// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const ImageSorting = (props) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{props.slug == "image-url" ? (
					<Sorting direction={props.sortOrder.imageUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "image-size" ? (
					<Sorting direction={props.sortOrder.imageSize} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "status" ? (
					<Sorting direction={props.sortOrder.status} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "http-code" ? (
					<Sorting direction={props.sortOrder.httpCode} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "occurrences" ? (
					<Sorting direction={props.sortOrder.occurrences} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : null}
			</div>
		</div>
	);
};

ImageSorting.propTypes = {};

export default ImageSorting;
