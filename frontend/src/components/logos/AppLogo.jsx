import Image from "next/image";
import { memo } from "react";
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
export const AppLogo = memo(({ alt = null, height = null, src = null, width = null }) => {
	return <Image src={src} alt={alt} width={width} height={height} priority />;
});
