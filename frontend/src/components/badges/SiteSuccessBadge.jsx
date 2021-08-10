// External
import "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Common
const Badge = loadable(() => import("./common/Badge"));

const SiteSuccessBadge = ({ text }) => {
	return <Badge isSuccess text={text} />;
};

SiteSuccessBadge.propTypes = {
	text: PropTypes.string
};

SiteSuccessBadge.defaultProps = {
	text: null
};

export default SiteSuccessBadge;
