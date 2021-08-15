// React
import * as React from "react";

// NextJS
import Image from "next/image";

// External
import PropTypes from "prop-types";

const AppImage = ({ alt, height, src, width }) => {
	return <Image src={src} alt={alt} width={width} height={height} />;
};

AppImage.propTypes = {
	alt: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};

AppImage.defaultProps = {
	alt: null,
	height: null,
	src: null,
	width: null
};

export default AppImage;
