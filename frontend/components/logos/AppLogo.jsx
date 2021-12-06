import Image from "next/image";
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
export function AppLogo({ alt = null, height = null, src = null, width = null }) {
	return <Image src={src} alt={alt} width={width} height={height} priority />;
}

/**
 * Memoized custom `AppLogo` component
 */
export const MemoizedAppLogo = memo(AppLogo);
