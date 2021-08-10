// External
import "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Common
const Badge = loadable(() => import("./common/Badge"));

const SiteDangerBadge = ({ text }) => {
	return <Badge isDanger text={text} />;
};

SiteDangerBadge.propTypes = {
	text: PropTypes.string
};

SiteDangerBadge.defaultProps = {
	text: null
};

export default SiteDangerBadge;
