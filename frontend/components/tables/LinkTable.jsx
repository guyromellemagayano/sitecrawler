// React
import Link from "next/link";

// External
import "twin.macro";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { LinkTableLabels } from "@enums/LinkTableLabels";

// Hooks
import { useLinkDetail } from "@hooks/useSite";

// Components
import SiteDangerBadge from "@components/badges/SiteDangerBadge";
import SiteSuccessBadge from "@components/badges/SiteSuccessBadge";
import SiteWarningBadge from "@components/badges/SiteWarningBadge";

const LinkTable = ({ componentReady, siteId, val }) => {
	const { linkDetail } = useLinkDetail({
		querySid: siteId,
		scanObjId: val.scan_id,
		linkId: val.id
	});

	return (
		<tr>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-200">
				<div tw="flex flex-col items-start">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							{componentReady ? (
								<Link
									href="/site/[siteId]/links/[linkId]/"
									as={`/site/${siteId}/links/${linkDetail?.id}/`}
									passHref
								>
									<a
										className="truncate-link"
										tw="text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
										title={val.url}
									>
										{val.url}
									</a>
								</Link>
							) : (
								<Skeleton duration={2} width={300} />
							)}
						</div>
						<div tw="flex justify-start leading-5 text-gray-500">
							{componentReady ? (
								<a
									href={val.url}
									target="_blank"
									title={LinkTableLabels[0].label}
									tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
								>
									{LinkTableLabels[0].label}
								</a>
							) : (
								<Skeleton duration={2} width={59.73} height={24} />
							)}
						</div>
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? (
					val.type === "PAGE" ? (
						"Internal"
					) : val.type === "EXTERNAL" ? (
						"External"
					) : (
						"Other"
					)
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
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
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? (
					linkDetail?.pages?.length > 0 ? (
						<Link
							href="/site/[siteId]/links/[linkId]/"
							as={`/site/${siteId}/links/${linkDetail?.id}/`}
							passHref
						>
							<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								<span className="truncate-link">
									{linkDetail?.pages[0]?.url == val.url ? "/" : linkDetail?.pages[0]?.url}
								</span>
								&nbsp;
								{linkDetail?.pages?.length - 1 > 0
									? "+" + parseInt(linkDetail?.pages?.length - 1)
									: null}{" "}
								{linkDetail?.pages?.length - 1 > 1
									? "others"
									: linkDetail?.pages?.length - 1 === 1
									? "other"
									: null}
							</a>
						</Link>
					) : null
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? val.occurences : <Skeleton duration={2} width={45} />}
			</td>
		</tr>
	);
};

LinkTable.propTypes = {
	componentReady: PropTypes.bool,
	siteId: PropTypes.number,
	http_status: PropTypes.string,
	id: PropTypes.number,
	occurences: PropTypes.number,
	scan_id: PropTypes.number,
	status: PropTypes.string,
	type: PropTypes.string,
	url: PropTypes.string
};

LinkTable.defaultProps = {
	componentReady: false,
	siteId: null,
	http_status: null,
	id: null,
	occurences: null,
	scan_id: null,
	status: null,
	type: null,
	url: null
};

export default LinkTable;
