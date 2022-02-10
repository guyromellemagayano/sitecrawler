import { DashboardSitesLink, SiteOverviewSlug } from "@constants/PageLinks";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

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
	const { user, isComponentReady } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const sanitizedSid = siteId !== null ? handleConversionStringToBoolean(siteId) : null;
	const sitesIdOverviewPageLink =
		sanitizedSid !== null && !asPath.includes(DashboardSitesLink)
			? `${DashboardSitesLink + sanitizedSid + SiteOverviewSlug}`
			: null;

	return (
		<nav tw="flex-none w-full pt-4 pb-8 border-b border-gray-200" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							<Link href={isOther && siteId == null ? DashboardSitesLink : sitesIdOverviewPageLink} passHref>
								<a tw="text-gray-400 hover:text-gray-500">
									<HomeIcon tw="flex-shrink-0 h-5 w-5" />
									<span tw="sr-only">{home}</span>
								</a>
							</Link>
						) : (
							<Skeleton duration={2} width={20} height={20} circle={true} />
						)}
					</div>
				</li>
				<li>
					<div tw="flex items-center">
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
						) : (
							<Skeleton duration={2} width={20} height={20} />
						)}

						{pageTitle !== null && pageTitle !== "" ? (
							pageDetailTitle !== null && pageDetailTitle !== "" ? (
								isSites ? (
									isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
										<Link href={DashboardSitesLink} passHref>
											<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
												{pageTitle}
											</a>
										</Link>
									) : (
										<Skeleton duration={2} width={128} height={20} tw="ml-4" />
									)
								) : isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
									<Link
										href={`${
											DashboardSitesLink +
											sanitizedSid +
											"/" +
											(isLinks ? "links" : isPages ? "pages" : isImages ? "images" : "seo")
										}`}
										passHref
									>
										<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
											{pageTitle}
										</a>
									</Link>
								) : (
									<Skeleton duration={2} width={128} height={20} tw="ml-4" />
								)
							) : (
								<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
									{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
										pageTitle
									) : (
										<Skeleton duration={2} width={128} height={20} />
									)}
								</p>
							)
						) : null}
					</div>
				</li>

				{pageDetailTitle !== null && pageDetailTitle !== "" ? (
					isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
						<li>
							<div tw="flex items-center">
								<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
								<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
									{pageDetailTitle}
								</p>
							</div>
						</li>
					) : (
						<li>
							<div tw="flex items-center">
								<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
								<Skeleton duration={2} width={128} height={20} tw="ml-4" />
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
