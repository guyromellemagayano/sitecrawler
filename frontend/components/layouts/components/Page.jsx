import { MemoizedBreadcrumbs } from "@components/breadcrumbs";
import { LoginLink, LogoutLink } from "@constants/PageLinks";
import { useLoading } from "@hooks/useLoading";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";
import { MemoizedFooter } from "./Footer";

/**
 * Custom function to render the `PageLayout` component
 *
 * @param {any} children
 * @param {string} pageTitle
 */
export function PageLayout({ children, pageTitle = null }) {
	// Router
	const router = useRouter();

	// Custom hooks
	const { isComponentReady } = useLoading();

	useEffect(() => {
		router.prefetch(LogoutLink);
		router.prefetch(LoginLink);
	}, [router]);

	return (
		<section tw="flex flex-col flex-nowrap items-start justify-start min-h-page px-12 py-8">
			<MemoizedBreadcrumbs isOther pageTitle={pageTitle} />

			<div tw="flex-grow flex flex-col flex-nowrap w-full">
				<div tw="w-full pt-12 pb-4">
					<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
						{isComponentReady ? pageTitle : <Skeleton duration={2} width={215} height={36} />}
					</h2>
				</div>

				{children}
			</div>

			<MemoizedFooter />
		</section>
	);
}

PageLayout.propTypes = {
	children: PropTypes.any,
	pageTitle: PropTypes.string
};

/**
 * Memoized custom `PageLayout` component
 */
export const MemoizedPageLayout = memo(PageLayout);
