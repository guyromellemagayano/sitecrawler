// External
import "twin.macro";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// Common
const Badge = loadable(() => import("./common/Badge"));

const SiteWarningBadge = ({ text }) => {
	return <Badge isWarning text={text} />;
};

SiteWarningBadge.propTypes = {
	text: PropTypes.string
};

SiteWarningBadge.defaultProps = {
	text: null
};

export default SiteWarningBadge;
