import { DashboardSlug } from "@constants/PageLinks";
import { useLoading } from "@hooks/useLoading";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
	const [isDashboard, setIsDashboard] = useState(false);

	// Router
	const { asPath } = useRouter();

	// Custom hooks
	const { isComponentReady } = useLoading();

	useEffect(() => {
		if (asPath.includes(DashboardSlug)) {
			setIsDashboard(true);
		}

		return () => {
			setIsDashboard(false);
		};
	}, [asPath]);

	return isDashboard ? (
		isComponentReady ? (
			<Image src={src} alt={alt} width={width} height={height} className={className} priority />
		) : (
			<Skeleton duration={2} width={200} height={45} />
		)
	) : (
		<Image src={src} alt={alt} width={width} height={height} className={className} priority />
	);
}

/**
 * Memoized custom `AppLogo` component
 */
export const MemoizedAppLogo = memo(AppLogo);
