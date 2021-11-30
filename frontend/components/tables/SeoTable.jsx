// React
// Enums
import { SeosTableLabels } from "@enums/SeosTableLabels";
// Hooks
import { usePageDetail } from "@hooks/useSite";
import dayjs from "dayjs";
import Link from "next/link";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
// External
import "twin.macro";




const SeoTable = ({ componentReady, siteId, val, disableLocalTime }) => {
	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

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
								href="/site/[siteId]/seo/[seoId]/"
								as={`/site/${siteId}/seo/${pageDetail?.id}/`}
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
						{componentReady && pageDetail ? (
							<a
								href={val.url}
								target="_blank"
								title={SeosTableLabels[0].label}
								tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
							>
								{SeosTableLabels[0].label}
							</a>
						) : (
							<Skeleton duration={2} width={59.73} height={24} />
						)}
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200">
				{componentReady && pageDetail ? (
					<span tw="space-x-2">
						<span tw="text-sm leading-5 text-gray-500">
							{!disableLocalTime
								? dayjs(pageDetail?.created_at).calendar(null, calendarStrings)
								: dayjs.utc(pageDetail?.created_at).calendar(null, calendarStrings)}
						</span>
						<span tw="text-sm leading-5 font-medium text-gray-500">
							({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
						</span>
					</span>
				) : (
					<Skeleton duration={2} width={299.98} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-200">
				{componentReady && pageDetail ? (
					<span tw="text-sm leading-5 text-gray-500">{pageDetail?.num_links}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td
				className="icon-status"
				tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-green-500"
			>
				{componentReady && pageDetail ? (
					pageDetail?.num_ok_links
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td
				className="icon-status"
				tw="px-6 whitespace-nowrap border-b border-gray-300 text-sm leading-5 text-red-500"
			>
				{componentReady && pageDetail ? (
					pageDetail?.num_non_ok_links
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
		</tr>
	);
};

SeoTable.propTypes = {
	componentReady: PropTypes.bool,
	disableLocalTime: PropTypes.bool,
	id: PropTypes.number,
	scan_id: PropTypes.number,
	siteId: PropTypes.number,
	url: PropTypes.string
};

SeoTable.defaultProps = {
	componentReady: false,
	disableLocalTime: false,
	siteId: null,
	id: null,
	scan_id: null,
	url: null
};

export default SeoTable;
