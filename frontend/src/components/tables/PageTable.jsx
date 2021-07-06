// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import PageTableLabel from "./labels/PageTable.json";

// Hooks
import { usePageDetail } from "src/hooks/useSite";

// Components
import SiteSuccessIcon from "src/components/icons/SiteSuccessIcon";
import SiteDangerIcon from "src/components/icons/SiteDangerIcon";

const PageTable = ({ siteId, val }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const { query } = useRouter();

	const { pageDetail } = usePageDetail({
		querySid: siteId,
		scanObjId: val?.scan_id,
		linkId: val?.id
	});

	React.useEffect(() => {
		pageDetail
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [pageDetail]);

	return (
		<tr>
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-200">
				<div tw="flex flex-col items-start">
					<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
						{componentReady ? (
							<Link
								href="/site/[siteId]/pages/[pageId]/details"
								as={`/site/${query.siteId}/pages/${pageDetail?.id}/details`}
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
								href={val?.url}
								target="_blank"
								title={PageTableLabel[0].label}
								tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
							>
								{PageTableLabel[0].label}
							</a>
						) : (
							<Skeleton duration={2} width={59.73} height={24} />
						)}
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? (
					bytes(val?.size_total, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200 text-sm text-gray-500 leading-5">
				{componentReady ? (
					val?.tls_total == true ? (
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

PageTable.propTypes = {};

export default PageTable;
