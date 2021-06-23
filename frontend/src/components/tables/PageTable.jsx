// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { styled } from "twin.macro";
import bytes from "bytes";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// Hooks
import { usePageDetail } from "src/hooks/useSite";

// Components
import SiteSuccessIcon from "src/components/icons/SiteSuccessIcon";
import SiteDangerIcon from "src/components/icons/SiteDangerIcon";

const PageTableDiv = styled.tr`
	.btn-detail {
		display: inline-block;
		padding: 8px 10px;
		line-height: 1;
		font-size: 0.7rem;
		margin-top: 5px;
	}
`;

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
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [pageDetail]);

	return (
		<PageTableDiv tw="bg-white">
			<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
				<div tw="flex flex-col items-start">
					<div className="link-item" tw="text-sm leading-5 font-medium text-gray-900">
						{componentReady ? (
							<a
								href={val?.url}
								target="_blank"
								title={val?.url}
								className="truncate-link"
								tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900 truncate"
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
								href="/site/[siteId]/pages/[pageId]/details"
								as={`/site/${query.siteId}/pages/${pageDetail?.id}/details`}
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
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
				{componentReady ? (
					bytes(val?.size_total, {
						thousandsSeparator: " ",
						unitSeparator: " "
					})
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-gray-500">
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
		</PageTableDiv>
	);
};

PageTable.propTypes = {};

export default PageTable;
