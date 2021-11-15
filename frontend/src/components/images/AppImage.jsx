import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";

const AppImage = ({ alt = null, height = null, src = null, width = null }) => {
	return <Image src={src} alt={alt} width={width} height={height} />;
};

AppImage.propTypes = {
	alt: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};

export default AppImage;
