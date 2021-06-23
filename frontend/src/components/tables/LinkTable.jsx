// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { styled } from "twin.macro";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Hooks
import { useLinkDetail } from "src/hooks/useSite";

// Components
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteWarningBadge from "src/components/badges/SiteWarningBadge";

const LinkTableTr = styled.tr`
	td {
		& > div {
			max-width: 100%;
			display: block;

			& > div {
				max-width: 100%;
				display: block;
			}
		}
	}

	.link-item {
		max-width: 100%;
		display: block;

		a {
			display: inline-block;
			clear: both;
		}
	}

	.btn-detail {
		display: inline-block;
		padding: 8px 10px;
		line-height: 1;
		font-size: 0.7rem;
		margin-top: 5px;
	}
`;

const LinkTable = ({ siteId, val }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const { linkDetail } = useLinkDetail({
		querySid: siteId,
		scanObjId: val?.scan_id,
		linkId: val?.id
	});

	React.useEffect(() => {
		linkDetail
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [linkDetail]);

	return (
		<LinkTableTr tw="bg-white">
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex flex-col items-center">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							{componentReady ? (
								<a
									href={val?.url}
									target="_blank"
									title={val?.url}
									className="truncate-link"
									tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
								>
									{val?.url}
								</a>
							) : (
								<Skeleton duration={2} width={300} />
							)}
						</div>
						<div tw="flex justify-start leading-5 text-gray-500">
							{componentReady ? (
								<Link
									href="/site/[siteId]/links/[linkId]/details"
									as={`/site/${siteId}/links/${linkDetail?.id}/details`}
									passHref
								>
									<a
										className="btn-detail"
										tw="mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										View Details
									</a>
								</Link>
							) : (
								<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
							)}
						</div>
					</div>
				</div>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					val?.type === "PAGE" ? (
						"Internal"
					) : val?.type === "EXTERNAL" ? (
						"External"
					) : (
						"Other"
					)
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					val?.status === "OK" ? (
						<SiteSuccessBadge text={"OK"} />
					) : val?.status === "TIMEOUT" ? (
						<SiteWarningBadge text={"TIMEOUT"} />
					) : val?.status === "HTTP_ERROR" ? (
						<SiteDangerBadge text={`${val?.http_status} HTTP ERROR`} />
					) : (
						<SiteDangerBadge text={"OTHER ERROR"} />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					linkDetail?.pages?.length > 0 ? (
						<Link
							href="/site/[siteId]/links/[linkId]/details"
							as={`/site/${siteId}/links/${linkDetail?.id}/details`}
							passHref
						>
							<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								<span className="truncate-link">
									{linkDetail?.pages[0]?.url == val?.url ? "/sites" : linkDetail?.pages[0]?.url}
								</span>
								&nbsp;
								{linkDetail?.pages?.length - 1 > 0 ? "+" + parseInt(linkDetail?.pages?.length - 1) : null}{" "}
								{linkDetail?.pages?.length - 1 > 1 ? "others" : linkDetail?.pages?.length - 1 === 1 ? "other" : null}
							</a>
						</Link>
					) : null
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? val?.occurences : <Skeleton duration={2} width={45} />}
			</td>
		</LinkTableTr>
	);
};

LinkTable.propTypes = {};

export default LinkTable;
