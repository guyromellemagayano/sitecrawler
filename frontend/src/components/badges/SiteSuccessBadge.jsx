// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Common
import Badge from "./common/Badge";

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
