// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

// Enums
import { BreadcrumbsLabels } from "@enums/BreadcrumbsLabels";
import { SitesLink } from "@enums/PageLinks";

const Breadcrumbs = ({
	dataId,
	isImages,
	isLinks,
	isOther,
	isPages,
	isSeo,
	isSites,
	pageDetailTitle,
	pageTitle,
	siteId
}) => {
	const homeLabel = BreadcrumbsLabels[0].label;
	const siteIdOverviewPageLink = `/site/${siteId}`;

	return (
		<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						<Link href={isOther && siteId == null ? SitesLink : siteIdOverviewPageLink} passHref>
							<a tw="text-gray-400 hover:text-gray-500">
								<HomeIcon tw="flex-shrink-0 h-5 w-5" />
								<span tw="sr-only">{homeLabel}</span>
							</a>
						</Link>
					</div>
				</li>
				<li>
					<div tw="flex items-center">
						<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />

						{dataId !== null && pageDetailTitle !== null ? (
							<Link
								href={`/site/${siteId}/${
									isLinks ? "links" : isPages ? "pages" : isImages ? "images" : isSeo ? "seo" : null
								}`}
								passHref
							>
								<a
									aria-current="page"
									className="truncate-breadcrumbs"
									tw="cursor-pointer ml-4 text-sm text-gray-700"
								>
									{pageTitle}
								</a>
							</Link>
						) : isSites && pageDetailTitle !== null ? (
							<Link href="/sites/" passHref>
								<a
									aria-current="page"
									className="truncate-breadcrumbs"
									tw="cursor-pointer ml-4 text-sm text-gray-700"
								>
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

				{(dataId !== null && pageDetailTitle !== null) || (isSites && pageDetailTitle !== null) ? (
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

Breadcrumbs.defaultProps = {
	dataId: null,
	isImages: false,
	isLinks: false,
	isOther: false,
	isPages: false,
	isSeo: false,
	isSites: false,
	pageDetailTitle: null,
	pageTitle: null,
	siteId: null
};

export default Breadcrumbs;
