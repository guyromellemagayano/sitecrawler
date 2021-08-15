// React
import * as React from "react";

// NextJS
import Image from "next/image";

// External
import PropTypes from "prop-types";

const AppImage = ({ alt, className, height, src, width }) => {
	return (
		<span className={className}>
			<Image src={src} alt={alt} width={width} height={height} />
		</span>
	);
};

AppImage.propTypes = {
	alt: PropTypes.string,
	className: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};

AppImage.defaultProps = {
	alt: null,
	className: null,
	height: null,
	src: null,
	width: null
};

export default AppImage;
