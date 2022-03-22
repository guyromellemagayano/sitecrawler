import { DashboardSitesLink } from "@constants/PageLinks";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ComingSoonPageLayout` component
 *
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isOther
 * @param {boolean} isPages
 * @param {boolean} isSites
 * @param {string} pageDetailTitle
 * @param {string} pageTitle
 * @param {number} siteId
 */
const Breadcrumbs = ({
	isImages = false,
	isLinks = false,
	isOther = false,
	isPages = false,
	isSites = false,
	pageDetailTitle = null,
	pageTitle = null,
	siteId = null
}) => {
	// Router
	const { asPath } = useRouter();

	// Translations
	const { t } = useTranslation("common");
	const home = t("home");

	// Custom context
	const { isComponentReady, querySiteId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sitesIdOverviewPageLink =
		querySiteId && !asPath.includes(DashboardSitesLink) ? `${DashboardSitesLink + querySiteId + "/"}` : null;

	return (
		<nav className="w-full flex-none border-b border-gray-200 pt-4 pb-8" aria-label="Breadcrumb">
			<ol className="flex items-center space-x-4">
				<li>
					<div>
						{isComponentReady ? (
							<Link href={isOther && siteId == null ? DashboardSitesLink : sitesIdOverviewPageLink} passHref replace>
								<a className="text-gray-400 hover:text-gray-500">
									<HomeIcon className="h-4 w-4 flex-shrink-0" />
									<span className="sr-only">{home}</span>
								</a>
							</Link>
						) : (
							<Skeleton duration={2} width={20} height={20} circle={true} />
						)}
					</div>
				</li>
				<li>
					<div className="flex items-center">
						{isComponentReady ? (
							<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
						) : (
							<Skeleton duration={2} width={20} height={20} />
						)}

						{pageTitle && pageTitle?.length > 0 ? (
							pageDetailTitle && pageDetailTitle?.length > 0 ? (
								isSites ? (
									isComponentReady ? (
										<Link href={DashboardSitesLink} passHref>
											<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
												{pageTitle}
											</a>
										</Link>
									) : (
										<Skeleton duration={2} width={128} height={20} className="ml-4" />
									)
								) : isComponentReady ? (
									<Link
										href={`${
											DashboardSitesLink +
											querySiteId +
											"/" +
											(isLinks ? "links" : isPages ? "pages" : isImages ? "images" : "seo")
										}`}
										passHref
									>
										<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
											{pageTitle}
										</a>
									</Link>
								) : (
									<Skeleton duration={2} width={128} height={20} className="ml-4" />
								)
							) : (
								<p aria-current="page" className="ml-4 cursor-default text-sm font-medium text-gray-700">
									{isComponentReady ? pageTitle : <Skeleton duration={2} width={128} height={20} />}
								</p>
							)
						) : null}
					</div>
				</li>

				{pageDetailTitle && pageDetailTitle?.length > 0 ? (
					isComponentReady ? (
						<li>
							<div className="flex items-center">
								<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
								<p aria-current="page" className="ml-4 cursor-default text-sm font-medium text-gray-700">
									{pageDetailTitle}
								</p>
							</div>
						</li>
					) : (
						<li>
							<div className="flex items-center">
								<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
								<Skeleton duration={2} width={128} height={20} className="ml-4" />
							</div>
						</li>
					)
				) : null}
			</ol>
		</nav>
	);
};

Breadcrumbs.propTypes = {
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isOther: PropTypes.bool,
	isPages: PropTypes.bool,
	isSites: PropTypes.bool,
	pageDetailTitle: PropTypes.string,
	pageTitle: PropTypes.string,
	siteId: PropTypes.number
};

/**
 * Memoized custom `Breadcrumbs` component
 */
export const MemoizedBreadcrumbs = memo(Breadcrumbs);
