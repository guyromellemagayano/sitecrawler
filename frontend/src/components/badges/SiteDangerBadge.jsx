// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Common
import Badge from "./common/Badge";

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
