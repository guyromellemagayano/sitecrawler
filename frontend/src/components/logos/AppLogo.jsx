// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import AppImage from "@components/images/AppImage";

const AppLogo = ({ alt, height, src, width, className }) => {
	return (
		<span className={className}>
			<AppImage src={src} alt={alt} width={width} height={height} />
		</span>
	);
};

AppLogo.propTypes = {
	alt: PropTypes.string,
	className: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};

AppLogo.defaultProps = {
	alt: null,
	className: null,
	height: null,
	src: null,
	width: null
};

export default AppLogo;
