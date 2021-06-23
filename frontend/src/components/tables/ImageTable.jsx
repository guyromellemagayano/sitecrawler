// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { styled } from "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Hooks
import { useImageDetail } from "src/hooks/useSite";

// Components
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteWarningBadge from "src/components/badges/SiteWarningBadge";

const ImagesTableDiv = styled.tr`
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

	.icon-status {
		text-align: left;
	}

	.btn-detail {
		display: inline-block;
		padding: 8px 10px;
		line-height: 1;
		font-size: 0.7rem;
		margin-top: 5px;
	}
`;

const ImagesTable = ({ siteId, val }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const { imageDetail } = useImageDetail({
		querySid: siteId,
		scanObjId: val.scan_id,
		linkId: val.id
	});

	React.useEffect(() => {
		imageDetail
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [imageDetail]);

	return (
		<ImagesTableDiv tw="bg-white">
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
									tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
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
									href="/site/[siteId]/images/[imageId]/details"
									as={`/site/${siteId}/images/${imageDetail?.id}/details`}
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
					bytes(val.size, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					val.status === "OK" ? (
						<SiteSuccessBadge text={"OK"} />
					) : val.status === "TIMEOUT" ? (
						<SiteWarningBadge text={"TIMEOUT"} />
					) : val.status === "HTTP_ERROR" ? (
						<SiteDangerBadge text={`${val.http_status} HTTP ERROR`} />
					) : (
						<SiteDangerBadge text={"OTHER ERROR"} />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					val.length !== 0 && (
						<Link
							href="/site/[siteId]/images/[imageId]/details"
							as={`/site/${siteId}/images/${imageDetail?.id}/details`}
							passHref
						>
							<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								<span className="truncate-link">
									{imageDetail?.pages[0]?.url == val?.url ? "/sites" : imageDetail?.pages[0]?.url}
								</span>
								&nbsp;
								{val.length - 1 > 0 ? "+" + parseInt(val.length - 1) : null}{" "}
								{val.length - 1 > 1 ? "others" : val.length - 1 === 1 ? "other" : null}
							</a>
						</Link>
					)
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? val.missing_alts : <Skeleton duration={2} width={45} />}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? val.occurences : <Skeleton duration={2} width={45} />}
			</td>
		</ImagesTableDiv>
	);
};

ImagesTable.propTypes = {};

export default ImagesTable;
