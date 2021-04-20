// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const PageSorting = (props) => {
	return (
		<div tw="flex flex-row mr-3">
			<div tw="inline-flex">
				<span>
					{props.user.permissions &&
					props.user.permissions !== undefined &&
					props.user.permissions.includes("can_see_images") &&
					props.user.permissions.includes("can_see_pages") &&
					props.user.permissions.includes("can_see_scripts") &&
					props.user.permissions.includes("can_see_stylesheets") &&
					props.user.permissions.includes("can_start_scan") ? (
						props.slug == "page-url" ? (
							<Sorting
								enabled={true}
								direction={props.sortOrder.pageUrl}
								onSortHandler={props.onSortHandler}
								slug={props.slug}
							/>
						) : props.slug == "page-size" ? (
							<Sorting
								enabled={true}
								direction={props.sortOrder.pageSize}
								onSortHandler={props.onSortHandler}
								slug={props.slug}
							/>
						) : props.slug == "page-ssl" ? (
							<Sorting
								enabled={true}
								direction={props.sortOrder.pageSsl}
								onSortHandler={props.onSortHandler}
								slug={props.slug}
							/>
						) : null
					) : props.slug == "page-url" ? (
						<Sorting enabled={false} direction={props.sortOrder.pageUrl} slug={props.slug} />
					) : props.slug == "page-size" ? (
						<Sorting enabled={false} direction={props.sortOrder.pageSize} slug={props.slug} />
					) : props.slug == "page-ssl" ? (
						<Sorting enabled={false} direction={props.sortOrder.pageSsl} slug={props.slug} />
					) : null}
				</span>
			</div>
		</div>
	);
};

PageSorting.propTypes = {};

export default PageSorting;
