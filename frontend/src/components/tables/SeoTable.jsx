// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { styled } from "twin.macro";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Hooks
import { usePageDetail } from "src/hooks/useSite";

const SeoTableDiv = styled.tr`
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
		}
	}

	.truncate-link {
		max-width: 7rem;
	}

	.icon-status {
		text-align: left;
		span {
			margin-left: auto;
			margin-right: auto;
			display: inline-block;
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

const SeoTable = ({ siteId, val, disableLocalTime }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const { pageDetail } = usePageDetail({
		querySid: siteId,
		scanObjId: val.scan_id,
		linkId: val.id
	});

	React.useEffect(() => {
		pageDetail
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [pageDetail]);

	return (
		<SeoTableDiv tw="bg-white">
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex items-center">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							{componentReady ? (
								<a
									href={val.url}
									target="_blank"
									title={val.url}
									className="truncate-link"
									tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900 truncate"
								>
									{val.url}
								</a>
							) : (
								<Skeleton duration={2} width={300} />
							)}
						</div>
						<div tw="flex justify-start leading-5 text-gray-500">
							{componentReady ? (
								<Link
									href="/site/[siteId]/seo/[seoId]/details"
									as={`/site/${siteId}/seo/${pageDetail?.id}/details`}
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
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300">
				{componentReady ? (
					<span tw="space-x-2">
						<span tw="text-sm leading-5 text-gray-500">
							{!disableLocalTime ? (
								<Moment calendar={calendarStrings} date={pageDetail?.created_at} local />
							) : (
								<Moment calendar={calendarStrings} date={pageDetail?.created_at} utc />
							)}
						</span>
						<span tw="text-sm leading-5 text-gray-500">
							{!disableLocalTime ? (
								<Moment date={pageDetail?.created_at} format="hh:mm:ss A" local />
							) : (
								<Moment date={pageDetail?.created_at} format="hh:mm:ss A" utc />
							)}
						</span>
						{disableLocalTime && <span tw="text-sm leading-5 font-medium text-gray-500">(UTC)</span>}
					</span>
				) : (
					<Skeleton duration={2} width={176.7} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300">
				{componentReady ? (
					<span tw="text-sm leading-5 text-gray-500">{pageDetail?.num_links}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="icon-status" tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-green-500">
				{componentReady ? pageDetail?.num_ok_links : <Skeleton duration={2} width={45} />}
			</td>
			<td className="icon-status" tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-red-500">
				{componentReady ? pageDetail?.num_non_ok_links : <Skeleton duration={2} width={45} />}
			</td>
		</SeoTableDiv>
	);
};

SeoTable.propTypes = {};

export default SeoTable;
