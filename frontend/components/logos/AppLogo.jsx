import Image from "next/image";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `AppLogo` component
 *
 * @param {string} alt
 * @param {number} height
 * @param {string} src
 * @param {number} width
 * @param {string} className
 */
export function AppLogo({ alt = null, height = null, src = null, width = null, className = null }) {
	return <Image src={src} alt={alt} width={width} height={height} className={className} priority />;
}

AppLogo.propTypes = {
	alt: PropTypes.string.isRequired,
	className: PropTypes.string.isRequired,
	height: PropTypes.number.isRequired,
	src: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired
};

/**
 * Memoized custom `AppLogo` component
 */
export const MemoizedAppLogo = memo(AppLogo);
