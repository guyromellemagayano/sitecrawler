import AppImage from "@components/images/AppImage";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const AppLogo = ({ alt = null, height = null, src = null, width = null, className = null }) => {
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

export default AppLogo;
