import { MemoizedBreadcrumbs } from "@components/breadcrumbs";
import { LoginLink, SubscriptionPlansSlug } from "@constants/PageLinks";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classNames } from "@utils/classNames";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MemoizedFooter } from "./Footer";

/**
 * Custom function to render the `PageLayout` component
 *
 * @param {any} children
 * @param {string} pageTitle
 */
const PageLayout = ({ children, pageTitle = null }) => {
	// Router
	const { asPath, prefetch } = useRouter();

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user } = useUser();

	useEffect(() => {
		prefetch(LoginLink);
	}, []);

	return (
		<section className="flex min-h-page flex-col flex-nowrap items-start justify-start px-12 py-8">
			<MemoizedBreadcrumbs isOther pageTitle={pageTitle} />

			<div className="flex w-full flex-grow flex-col flex-nowrap">
				<div className="w-full pt-12 pb-4">
					<h2
						className={classNames(
							asPath.includes(SubscriptionPlansSlug) ? "text-center" : null,
							"text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl"
						)}
					>
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							pageTitle
						) : (
							<Skeleton duration={2} width={215} height={36} />
						)}
					</h2>
				</div>

				{children}
			</div>

			<MemoizedFooter />
		</section>
	);
};

PageLayout.propTypes = {
	children: PropTypes.any,
	pageTitle: PropTypes.string
};

/**
 * Memoized custom `PageLayout` component
 */
export const MemoizedPageLayout = memo(PageLayout);
