import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";

/**
 * Memoized function to render the `AppImage` component.
 *
 * @param {string} alt
 * @param {number} height
 * @param {string} src
 * @param {number} width
 */
export const AppImage = React.memo(({ alt = null, height = null, src = null, width = null }) => {
	return <Image src={src} alt={alt} width={width} height={height} />;
});

AppImage.propTypes = {
	alt: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};
