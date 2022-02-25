import Image from "next/image";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `AppLogo` component
 *
 * @param {string} alt
 * @param {number} height
 * @param {string} src
 * @param {number} width
 * @param {string} className
 */
const AppLogo = ({ alt = null, height = null, src = null, width = null, className = null }) => {
	return <Image src={src} alt={alt} width={width} height={height} className={className} priority />;
};

AppLogo.propTypes = {
	alt: PropTypes.string,
	className: PropTypes.string,
	height: PropTypes.number,
	src: PropTypes.string,
	width: PropTypes.number
};

/**
 * Memoized custom `AppLogo` component
 */
export const MemoizedAppLogo = memo(AppLogo);
