// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const ImageSorting = (props) => {
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
					{props.slug == "image-url" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.imageUrl}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "image-size" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.imageSize}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "status" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.status}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "http-code" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.httpCode}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : props.slug == "occurrences" ? (
						<Sorting
							enabled={true}
							direction={props.sortOrder.occurrences}
							onSortHandler={props.onSortHandler}
							slug={props.slug}
						/>
					) : null}
				</span>
			</div>
		</div>
	) : null;
};

ImageSorting.propTypes = {};

export default ImageSorting;
