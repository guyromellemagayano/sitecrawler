// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { InformationCircleIcon } from "@heroicons/react/outline";
import { styled } from "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import Url from "url-parse";

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

	.truncate-link {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 30rem;
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

const ImagesTable = (props) => {
	const [componentReady, setComponentReady] = useState(false);

	const { query } = useRouter();

	const { imageDetail: imageDetail } = useImageDetail({
		querySid: query.siteId,
		scanObjId: props.val.scan_id,
		linkId: props.val.id
	});

	useEffect(() => {
		if (imageDetail && imageDetail !== undefined && imageDetail !== [] && Object.keys(imageDetail).length > 0) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [imageDetail]);

	return (
		<ImagesTableDiv tw="bg-white">
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex items-center">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							{componentReady ? (
								<a
									href={props.val.url}
									target="_blank"
									title={props.val.url}
									tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900 truncate"
								>
									{props.val.url}
								</a>
							) : (
								<Skeleton duration={2} width={300} />
							)}
						</div>
						<div tw="flex justify-start leading-5 text-gray-500">
							{componentReady ? (
								imageDetail && imageDetail !== undefined && imageDetail !== [] ? (
									Object.keys(imageDetail).length > 0 && (
										<Link
											href="/site/[siteId]/images/[imageId]/details"
											as={`/site/${query.siteId}/images/${imageDetail.id}/details`}
											passHref
										>
											<a
												className="btn-detail"
												tw="mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											>
												View Details
											</a>
										</Link>
									)
								) : (
									<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
								)
							) : (
								<Skeleton duration={2} className="btn-detail" width={82.2} height={27} />
							)}
						</div>
					</div>
				</div>
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					bytes(props.val.size, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					props.val.status === "OK" ? (
						<SiteSuccessBadge text={"OK"} />
					) : props.val.status === "TIMEOUT" ? (
						<SiteWarningBadge text={"TIMEOUT"} />
					) : props.val.status === "HTTP_ERROR" ? (
						<>
							<span tw="flex items-center justify-start">
								<SiteDangerBadge text={`${props.val.http_status} HTTP ERROR`} />
								<a
									data-tip=""
									data-for={props.val.url}
									data-background-color={"#E53E3E"}
									data-iscapture={true}
									data-scroll-hide={false}
									tw="flex cursor-pointer"
								>
									<InformationCircleIcon tw="ml-2 text-red-400 inline-block w-4 h-4 overflow-hidden" />
								</a>
								<ReactTooltip
									id={props.val.url}
									className={`${props.val.status + "-tooltip"} w-36`}
									type="dark"
									effect="solid"
									place="bottom"
									clickable={true}
									multiline={true}
								>
									<span tw="text-left text-xs leading-4 font-normal text-white normal-case tracking-wider">
										<p>
											<strong>{props.val.error}</strong>
										</p>
									</span>
								</ReactTooltip>
							</span>
						</>
					) : (
						<SiteDangerBadge text={"OTHER ERROR"} />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					imageDetail &&
					imageDetail !== undefined &&
					imageDetail !== [] &&
					Object.keys(imageDetail).length > 0 &&
					props.val.length !== 0 && (
						<Link
							href="/site/[siteId]/images/[imageId]/details"
							as={`/site/${query.siteId}/images/${imageDetail.id}/details`}
							passHref
						>
							<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								<span className="truncate-link">
									{props.val[0] && Url(props.val[0].url).pathname !== "" ? (
										Url(props.val[0].url).pathname
									) : (
										<em>_domain</em>
									)}
								</span>
								&nbsp;
								{props.val.length - 1 > 0 ? "+" + parseInt(props.val.length - 1) : null}{" "}
								{props.val.length - 1 > 1 ? "others" : props.val.length - 1 === 1 ? "other" : null}
							</a>
						</Link>
					)
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? props.val.occurences : <Skeleton duration={2} width={45} />}
			</td>
		</ImagesTableDiv>
	);
};

ImagesTable.propTypes = {};

export default ImagesTable;
