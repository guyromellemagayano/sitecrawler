// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import ImageTableLabel from "./labels/ImageTable.json";

// Hooks
import { useImageDetail } from "src/hooks/useSite";

// Components
import SiteDangerBadge from "src/components/badges/SiteDangerBadge";
import SiteSuccessBadge from "src/components/badges/SiteSuccessBadge";
import SiteWarningBadge from "src/components/badges/SiteWarningBadge";

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
		<tr>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-200">
				<div tw="flex items-center">
					<div>
						<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
							{componentReady ? (
								<Link
									href="/site/[siteId]/images/[imageId]/details"
									as={`/site/${siteId}/images/${imageDetail?.id}/details`}
									passHref
								>
									<a
										className="truncate-link"
										tw="text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
										title={val?.url}
									>
										{val?.url}
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
									title={ImageTableLabel[0].label}
									tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
								>
									{ImageTableLabel[0].label}
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
					bytes(val.size, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
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
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? val.missing_alts : <Skeleton duration={2} width={45} />}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? val.occurences : <Skeleton duration={2} width={45} />}
			</td>
		</tr>
	);
};

ImagesTable.propTypes = {};

export default ImagesTable;
