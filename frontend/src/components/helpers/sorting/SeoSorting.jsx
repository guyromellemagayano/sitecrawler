// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/page/site/Sorting"));

const SeoSorting = (props) => {
	return props.user.permissions &&
		props.user.permissions !== undefined &&
		props.user.permissions.includes("can_see_images") &&
		props.user.permissions.includes("can_see_pages") &&
		props.user.permissions.includes("can_see_scripts") &&
		props.user.permissions.includes("can_see_stylesheets") &&
		props.user.permissions.includes("can_start_scan") ? (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{props.slug == "page-url" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.pageUrl}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "created-at" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.createdAt}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "total-links" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.totalLinks}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "total-ok-links" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.totalOkLinks}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "total-non-ok-links" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.totalNonOkLinks}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

SeoSorting.propTypes = {};

export default SeoSorting;
