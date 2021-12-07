/* eslint-disable jsx-a11y/anchor-is-valid */
import { DashboardSitesLink, DashboardSiteSlug, SiteOverviewSlug, SiteSlug } from "@constants/PageLinks";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import { memo } from "react";
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
export function Breadcrumbs({
	isImages = false,
	isLinks = false,
	isOther = false,
	isPages = false,
	isSites = false,
	pageDetailTitle = null,
	pageTitle = null,
	siteId = null
}) {
	const sanitizedSiteId =
		typeof siteId !== "undefined" && siteId !== null && siteId !== 0
			? typeof siteId !== "string"
				? parseInt(siteId)
				: siteId
			: null;
	const siteIdOverviewPageLink = `${SiteSlug + sanitizedSiteId + SiteOverviewSlug}`;

	// Translations
	const { t } = useTranslation("common");
	const home = t("home");

	return (
		<nav tw="flex pt-4 pb-8 border-b border-gray-200" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						<Link
							href={
								isOther && typeof siteId !== "undefined" && siteId == null ? DashboardSitesLink : siteIdOverviewPageLink
							}
							passHref
						>
							<a tw="text-gray-400 hover:text-gray-500">
								<HomeIcon tw="flex-shrink-0 h-5 w-5" />
								<span tw="sr-only">{home}</span>
							</a>
						</Link>
					</div>
				</li>
				<li>
					<div tw="flex items-center">
						<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />

						{typeof pageDetailTitle !== "undefined" && pageDetailTitle !== null && pageDetailTitle !== "" ? (
							isSites ? (
								<Link href={DashboardSitesLink} passHref>
									<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
										{pageTitle}
									</a>
								</Link>
							) : (
								<Link
									href={`${
										DashboardSiteSlug +
										sanitizedSiteId +
										(isLinks ? "links" : isPages ? "pages" : isImages ? "images" : "seo")
									}`}
									passHref
								>
									<a aria-current="page" tw="cursor-pointer ml-4 text-sm text-gray-700">
										{pageTitle}
									</a>
								</Link>
							)
						) : (
							<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
								{pageTitle}
							</p>
						)}
					</div>
				</li>

				{typeof pageDetailTitle !== "undefined" && pageDetailTitle !== null && pageDetailTitle !== "" ? (
					<li>
						<div tw="flex items-center">
							<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
							<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
								{pageDetailTitle}
							</p>
						</div>
					</li>
				) : null}
			</ol>
		</nav>
	);
}

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
