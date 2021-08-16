// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Enums
import { PageTableLabels } from "@enums/PageTableLabels";

// Hooks
import { usePageDetail } from "@hooks/useSite";

// Components
import SiteSuccessIcon from "@components/icons/SiteSuccessIcon";
import SiteDangerIcon from "@components/icons/SiteDangerIcon";

const PageTable = ({ componentReady, siteId, val }) => {
	const { pageDetail } = usePageDetail({
		querySid: siteId,
		scanObjId: val.scan_id,
		linkId: val.id
	});

	return (
		<tr>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-200">
				<div tw="flex flex-col items-start">
					<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
						{componentReady && pageDetail ? (
							<Link
								href="/site/[siteId]/pages/[pageId]/"
								as={`/site/${siteId}/pages/${pageDetail?.id}/`}
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
						{componentReady && pageDetail ? (
							<a
								href={val.url}
								target="_blank"
								title={PageTableLabels[0].label}
								tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
							>
								{PageTableLabels[0].label}
							</a>
						) : (
							<Skeleton duration={2} width={59.73} height={24} />
						)}
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady && pageDetail ? (
					bytes(val.size_total, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady && pageDetail ? (
					val.tls_total == true ? (
						<SiteSuccessIcon />
					) : (
						<SiteDangerIcon />
					)
				) : (
					<Skeleton duration={2} width={30} />
				)}
			</td>
		</tr>
	);
};

PageTable.propTypes = {
	componentReady: PropTypes.bool,
	siteId: PropTypes.number,
	id: PropTypes.number,
	scan_id: PropTypes.number,
	size_total: PropTypes.number,
	tls_total: PropTypes.string,
	url: PropTypes.string
};

PageTable.defaultProps = {
	componentReady: false,
	siteId: null,
	id: null,
	scan_id: null,
	size_total: null,
	tls_total: null,
	url: null
};

export default PageTable;
