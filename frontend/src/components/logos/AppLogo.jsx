import Image from "next/image";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

/**
 * Memoized function to render the `AppLogo` component.
 *
 * @param {string} alt
 * @param {number} height
 * @param {string} src
 * @param {number} width
 * @param {string} className
 */
export const AppLogo = React.memo(({ alt = null, height = null, src = null, width = null }) => {
	return <Image src={src} alt={alt} width={width} height={height} priority />;
});

AppLogo.propTypes = {
	alt: PropTypes.string,
	className: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};
