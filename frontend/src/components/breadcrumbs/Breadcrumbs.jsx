// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

// JSON
import BreadcrumbsLabel from "./labels/Breadcrumbs.json";

const Breadcrumbs = (props) => {
	const homeLabel = BreadcrumbsLabel[0].label;
	const sitesDashboardPageLink = `/sites/`;
	const siteIdOverviewPageLink = `/site/${props.siteId}/overview/`;

	return (
		<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						<Link
							href={props.isOther && props.siteId == null ? sitesDashboardPageLink : siteIdOverviewPageLink}
							passHref
						>
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

						{props.dataId !== null && props.pageDetailTitle !== null ? (
							<Link
								href={`/site/${props.siteId}/${
									props.isLinks
										? "links"
										: props.isPages
										? "pages"
										: props.isImages
										? "images"
										: props.isSeo
										? "seo"
										: null
								}`}
								passHref
							>
								<a aria-current="page" className="truncate-breadcrumbs" tw="cursor-pointer ml-4 text-sm text-gray-700">
									{props.pageTitle}
								</a>
							</Link>
						) : props.isSites && props.pageDetailTitle !== null ? (
							<Link href="/sites/" passHref>
								<a aria-current="page" className="truncate-breadcrumbs" tw="cursor-pointer ml-4 text-sm text-gray-700">
									{props.pageTitle}
								</a>
							</Link>
						) : (
							<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
								{props.pageTitle}
							</p>
						)}
					</div>
				</li>

				{(props.dataId !== null && props.pageDetailTitle !== null) ||
				(props.isSites && props.pageDetailTitle !== null) ? (
					<li>
						<div tw="flex items-center">
							<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
							<p
								aria-current="page"
								className="truncate-breadcrumbs"
								tw="cursor-default ml-4 text-sm font-medium text-gray-700"
							>
								{props.pageDetailTitle}
							</p>
						</div>
					</li>
				) : null}
			</ol>
		</nav>
	);
};

Breadcrumbs.defaultProps = {
	siteId: null,
	dataId: null,
	pageDetailTitle: null
};

export default Breadcrumbs;
