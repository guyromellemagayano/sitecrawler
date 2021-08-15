// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Common
import Badge from "./common/Badge";

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
