// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/page/site/Sorting"));

const LinkSorting = (props) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{props.slug == "link-url" ? (
					<Sorting direction={props.sortOrder.linkUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "url-type" ? (
					<Sorting direction={props.sortOrder.urlType} onSortHandler={props.onSortHandler} slug={props.slug} />
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

LinkSorting.propTypes = {};

export default LinkSorting;
