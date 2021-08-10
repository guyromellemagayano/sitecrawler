// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Components
import AppImage from "@components/images/AppImage";

const AppLogo = ({ alt, height, src, width, "data-tw": dataTw }) => {
	return (
		<div tw="flex w-auto">
			<AppImage src={src} alt={alt} width={width} height={height} className={dataTw} />
		</div>
	);
};

AppLogo.propTypes = {
	alt: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number,
	dataTw: PropTypes.string
};

AppLogo.defaultProps = {
	alt: null,
	height: null,
	src: null,
	width: null,
	dataTw: null
};

export default AppLogo;
