// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { styled } from "twin.macro";
import PropTypes from "prop-types";

// JSON
import BreadcrumbsLabel from "./labels/Breadcrumbs.json";

const BreadcrumbNav = styled.nav`
	.truncate-breadcrumbs {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 30rem;
	}
`;

const Breadcrumbs = ({ isOther, isLinks, isPages, isImages, isSeo, siteId, dataId, pageTitle, pageDetailTitle }) => {
	const homeLabel = BreadcrumbsLabel[0].label;
	const sitesDashboardPageLink = `/sites/`;
	const siteIdOverviewPageLink = `/site/${siteId}/overview/`;

	return (
		<BreadcrumbNav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
			<ol tw="flex items-center space-x-4">
				<li>
					<div>
						<Link href={isOther && siteId == null ? sitesDashboardPageLink : siteIdOverviewPageLink} passHref>
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

				{dataId !== null && pageDetailTitle !== null ? (
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
		</BreadcrumbNav>
	);
};

Breadcrumbs.defaultProps = {
	siteId: null,
	dataId: null,
	pageDetailTitle: null
};

export default Breadcrumbs;
