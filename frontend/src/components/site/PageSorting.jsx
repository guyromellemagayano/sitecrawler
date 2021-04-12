// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import "twin.macro";

// Components
const Sorting = loadable(() => import("src/components/site/Sorting"));

const PageSorting = (props) => {
  return (
    <div className="flex flex-row mr-3">
      <div className={`inline-flex`}>
        {props.slug == "page-url" ? (
          <Sorting
            direction={props.sortOrder.pageUrl}
            onSortHandler={props.onSortHandler}
            slug={props.slug}
          />
        ) : props.slug == "page-size" ? (
          <Sorting
            direction={props.sortOrder.pageSize}
            onSortHandler={props.onSortHandler}
            slug={props.slug}
          />
        ) : props.slug == "page-ssl" ? (
          <Sorting
            direction={props.sortOrder.pageSsl}
            onSortHandler={props.onSortHandler}
            slug={props.slug}
          />
        ) : null}
      </div>
    </div>
  );
};

PageSorting.propTypes = {};

export default PageSorting;
