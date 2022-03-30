import {
	AddNewSiteSlug,
	DashboardSettingsSlug,
	DashboardSitesLink,
	SiteImagesSlug,
	SiteLinksSlug,
	SitePagesSlug
} from "@constants/PageLinks";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `ComingSoonPageLayout` component
 *
 * @param {boolean} isImages
 * @param {boolean} isLinks
 * @param {boolean} isPages
 * @param {boolean} isSites
 * @param {boolean} isSettings
 * @param {string} pageDetailTitle
 * @param {string} pageTitle
 */
const Breadcrumbs = ({
	isImages = false,
	isLinks = false,
	isPages = false,
	isSites = false,
	isSettings = false,
	pageDetailTitle = null,
	pageTitle = null
}) => {
	const [siteQueries, setSiteQueries] = useState(null);

	// Router
	const { asPath, isReady } = useRouter();

	// Translations
	const { t } = useTranslation();
	const home = t("common:home");
	const sitesOverviewText = t("sites:sitesOverview");
	const sitesLinksText = t("sites:sitesLinks");
	const sitesPagesText = t("sites:sitesPages");
	const sitesImagesText = t("sites:sitesImages");

	// Custom context
	const { isComponentReady, querySiteId, queryLinkId, queryPageId, queryImageId } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sitesIdOverviewPageLink =
		querySiteId && !asPath.includes(DashboardSitesLink) ? `${DashboardSitesLink + querySiteId + "/"}` : null;

	useEffect(() => {
		isReady ? setSiteQueries(window.location.search) : setSiteQueries(null);

		return { siteQueries };
	}, [isReady]);

	return (
		<nav className="w-full flex-none border-b border-gray-200 pt-4 pb-8" aria-label="Breadcrumb">
			<ol className="flex items-center space-x-4">
				<li>
					<div>
						{isComponentReady ? (
							<Link href={DashboardSitesLink} passHref replace>
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

				{isComponentReady ? (
					(pageTitle?.length > 0 &&
						!isSites &&
						(asPath.includes(
							DashboardSitesLink +
								querySiteId +
								(asPath.includes("links")
									? SiteLinksSlug
									: asPath.includes("pages")
									? SitePagesSlug
									: asPath.includes("images")
									? SiteImagesSlug
									: "") +
								(queryLinkId ? queryLinkId + "/" : "") +
								(queryPageId ? queryPageId + "/" : "") +
								(queryImageId ? queryImageId + "/" : "") +
								siteQueries
						) ||
							asPath.includes(DashboardSettingsSlug))) ||
					asPath.includes(AddNewSiteSlug) ? (
						<>
							<li>
								<div className="flex items-center">
									<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />

									{!asPath.includes(DashboardSettingsSlug) &&
									!asPath.includes(AddNewSiteSlug) &&
									asPath !== DashboardSitesLink + querySiteId + "/" ? (
										<Link href={DashboardSitesLink + querySiteId + "/"} passHref>
											<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
												{sitesOverviewText}
											</a>
										</Link>
									) : (
										<Link href={asPath} passHref>
											<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
												{pageTitle}
											</a>
										</Link>
									)}
								</div>
							</li>

							{!asPath.includes(DashboardSettingsSlug) &&
							!asPath.includes(AddNewSiteSlug) &&
							asPath !== DashboardSitesLink + querySiteId + "/" ? (
								queryLinkId || queryPageId || queryImageId ? (
									<>
										<li>
											<div className="flex items-center">
												<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />

												<Link
													href={
														queryLinkId
															? DashboardSitesLink + querySiteId + SiteLinksSlug
															: queryPageId
															? DashboardSitesLink + querySiteId + SitePagesSlug
															: DashboardSitesLink + querySiteId + SiteImagesSlug
													}
													passHref
												>
													<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
														{queryLinkId ? sitesLinksText : queryPageId ? sitesPagesText : sitesImagesText}
													</a>
												</Link>
											</div>
										</li>

										<li>
											<div className="flex items-center">
												<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />

												<Link href={asPath} passHref>
													<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
														{pageTitle}
													</a>
												</Link>
											</div>
										</li>
									</>
								) : (
									<li>
										<div className="flex items-center">
											<ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />

											<Link href={asPath} passHref>
												<a aria-current="page" className="ml-4 cursor-pointer text-sm text-gray-700">
													{pageTitle}
												</a>
											</Link>
										</div>
									</li>
								)
							) : null}
						</>
					) : null
				) : (
					<>
						<li>
							<div className="flex items-center">
								<Skeleton duration={2} width={20} height={20} />
								<Skeleton duration={2} width={128} height={20} className="ml-4" />
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<Skeleton duration={2} width={20} height={20} />
								<Skeleton duration={2} width={128} height={20} className="ml-4" />
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<Skeleton duration={2} width={20} height={20} />
								<Skeleton duration={2} width={128} height={20} className="ml-4" />
							</div>
						</li>
					</>
				)}
			</ol>
		</nav>
	);
};

Breadcrumbs.propTypes = {
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isPages: PropTypes.bool,
	isSites: PropTypes.bool,
	pageDetailTitle: PropTypes.string,
	pageTitle: PropTypes.string
};

/**
 * Memoized custom `Breadcrumbs` component
 */
export const MemoizedBreadcrumbs = memo(Breadcrumbs);
