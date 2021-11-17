import { SitesLink } from "@enums/PageLinks";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import PropTypes from "prop-types";
import * as React from "react";
import "twin.macro";

const Breadcrumbs = (
	dataId = null,
	isImages = false,
	isLinks = false,
	isOther = false,
	isPages = false,
	isSeo = false,
	isSites = false,
	pageDetailTitle = null,
	pageTitle = null,
	siteId = null
) => {
	const sanitizedSiteId =
		typeof siteId !== "undefined" && siteId !== null
			? (() => {
					typeof siteId !== "string" ? parseInt(siteId) : siteId;
			  })()
			: null;
	const siteIdOverviewPageLink = `/site/${sanitizedSiteId}/overview/`;

	// Translations
	const { t } = useTranslation("common");
	const home = t("home");

	return (
		<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						<Link
							href={isOther && typeof siteId !== "undefined" && siteId == null ? SitesLink : siteIdOverviewPageLink}
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

						{typeof dataId !== "undefined" &&
						dataId !== null &&
						dataId !== 0 &&
						typeof pageDetailTitle !== "undefined" &&
						pageDetailTitle !== null &&
						pageDetailTitle !== "" ? (
							<Link
								href={`/site/${sanitizedSiteId}/${
									isLinks ? "links" : isPages ? "pages" : isImages ? "images" : isSeo ? "seo" : null
								}`}
								passHref
							>
								<a aria-current="page" className="truncate-breadcrumbs" tw="cursor-pointer ml-4 text-sm text-gray-700">
									{pageTitle}
								</a>
							</Link>
						) : isSites &&
						  typeof pageDetailTitle !== "undefined" &&
						  pageDetailTitle !== null &&
						  pageDetailTitle !== "" ? (
							<Link href="/sites/" passHref>
								<a aria-current="page" className="truncate-breadcrumbs" tw="cursor-pointer ml-4 text-sm text-gray-700">
									{pageTitle}
								</a>
							</Link>
						) : (
							<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
								{pageTitle}
							</p>
						)}
					</div>
				</li>

				{(typeof dataId !== "undefined" &&
					dataId !== null &&
					dataId !== 0 &&
					typeof pageDetailTitle !== "undefined" &&
					pageDetailTitle !== null &&
					pageDetailTitle !== "") ||
				(isSites && typeof pageDetailTitle !== "undefined" && pageDetailTitle !== null && pageDetailTitle !== "") ? (
					<li>
						<div tw="flex items-center">
							<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
							<p
								aria-current="page"
								className="truncate-breadcrumbs"
								tw="cursor-default ml-4 text-sm font-medium text-gray-700"
							>
								{pageDetailTitle}
							</p>
						</div>
					</li>
				) : null}
			</ol>
		</nav>
	);
};

Breadcrumbs.propTypes = {
	dataId: PropTypes.number,
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isOther: PropTypes.bool,
	isPages: PropTypes.bool,
	isSeo: PropTypes.bool,
	isSites: PropTypes.bool,
	pageDetailTitle: PropTypes.string,
	pageTitle: PropTypes.string,
	siteId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Breadcrumbs;
