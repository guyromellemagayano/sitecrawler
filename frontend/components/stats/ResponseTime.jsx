import { MemoizedUptimeResponseTimeStatsSkeleton } from "@components/skeletons/UptimeResponseTimeStats";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";

// Dynamic
const Chart = dynamic(() => import("react-apexcharts"), {
	ssr: false,
	loading: () => <MemoizedUptimeResponseTimeStatsSkeleton />
});

/**
 * Custom function to render the `ResponseTimeStats` component
 */
const ResponseTimeStats = () => {
	// Translations
	const { t } = useTranslation();
	const uptimeText = t("sites:uptime");
	const responseTimeText = t("sites:responseTime");
	const statusText = t("sites:status");
	const createdAtText = t("sites:createdAt");

	// Custom context
	const { isComponentReady, querySiteId, uptime, user } = useContext(SiteCrawlerAppContext);

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

	// Custom variables
	let uptimeResponseTime = [];
	let uptimeHttpStatus = [];
	let uptimeStatus = [];
	let uptimeCreatedAt = [];
	let uptimeError = [];

	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const uptimeData = uptime?.data ?? null;

	uptimeData?.map((item) => {
		const createdAtTimestamp = item.created_at;
		const createdAt = !disableLocalTime
			? dayjs(createdAtTimestamp).calendar(null, calendarStrings)
			: dayjs.utc(createdAtTimestamp).calendar(null, calendarStrings);

		uptimeResponseTime.push(item.response_time);
		uptimeHttpStatus.push(item.http_status);
		uptimeStatus.push(item.status);
		uptimeCreatedAt.push(createdAt);
		uptimeError.push(item.error);
	});

	const chartSeries = [
		{
			name: responseTimeText,
			data: uptimeResponseTime
		}
	];

	const primaryChartOptions = {
		chart: {
			id: "uptimeResponseTime",
			type: "area",
			zoom: {
				enabled: false
			}
		},
		dataLabels: {
			enabled: false
		},
		fill: {
			type: "solid",
			colors: "#10b981"
		},
		stroke: {
			show: true,
			curve: "smooth",
			colors: ["#059669"]
		},
		markers: {
			size: 5,
			colors: "#10b981"
		},
		grid: {
			row: {
				colors: ["#f3f3f3", "transparent"],
				opacity: 0.35
			}
		},
		xaxis: {
			title: {
				text: responseTimeText,
				offsetY: 10
			},
			categories: uptimeCreatedAt,
			labels: {
				show: true,
				rotate: -90,
				offsetX: 10,
				minWidth: 250,
				maxHeight: 250
			}
		},
		yaxis: {
			title: {
				text: responseTimeText,
				offsetX: -20
			},
			categories: uptimeResponseTime,
			labels: {
				show: true,
				minWidth: 25,
				maxHeight: 50
			}
		}
	};

	const secondaryChartOptions = {};

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? (
							uptimeText + " " + `(${responseTimeText})`
						) : (
							<Skeleton duration={2} width={100} height={15} />
						)}
					</h2>
				</div>
			</div>
			<div className="mx-auto flex justify-center px-5">
				<div className="mt-4 mb-8 flow-root w-full">
					<Chart options={primaryChartOptions} series={chartSeries} type="area" height={800} />
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `ResponseTimeStats` component
 */
export const MemoizedResponseTimeStats = memo(ResponseTimeStats);
