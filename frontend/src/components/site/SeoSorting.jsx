// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const SeoSorting = (props) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				{props.slug == "page-url" ? (
					<Sorting direction={props.sortOrder.pageUrl} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "created-at" ? (
					<Sorting direction={props.sortOrder.createdAt} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "total-links" ? (
					<Sorting direction={props.sortOrder.totalLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "total-ok-links" ? (
					<Sorting direction={props.sortOrder.totalOkLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : props.slug == "total-non-ok-links" ? (
					<Sorting direction={props.sortOrder.totalNonOkLinks} onSortHandler={props.onSortHandler} slug={props.slug} />
				) : (
					""
				)}
			</div>
		</div>
	);
};

SeoSorting.propTypes = {};

export default SeoSorting;
