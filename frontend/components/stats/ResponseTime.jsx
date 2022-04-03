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

	// Custom variables
	let uptimeResponseTime = [];
	let uptimeHttpStatus = [];
	let uptimeStatus = [];
	let uptimeCreatedAt = [];
	let uptimeError = [];

	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const uptimeData = uptime?.data ?? null;
	const uptimeFirstEntry = uptimeData?.[0]?.created_at ?? null;
	const uptimeLastEntry = uptimeData?.[uptimeData?.length - 1]?.created_at ?? null;

	uptimeData?.map((item) => {
		const createdAtTimestamp = item.created_at;
		const createdAt = !disableLocalTime
			? dayjs(createdAtTimestamp).calendar(null, "MMMM DD, YYYY [at] hh:mm:ss A")
			: dayjs.utc(createdAtTimestamp).calendar(null, "MMMM DD, YYYY [at] hh:mm:ss A");

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
			id: "primaryChart",
			type: "line",
			height: 500,
			toolbar: {
				autoSelected: "pan",
				show: false
			}
		},
		stroke: {
			curve: "smooth",
			colors: ["#16a34a"],
			width: 5
		},
		dataLabels: {
			enabled: false
		},
		markers: {
			size: 5,
			colors: "#15803d",
			hover: {
				size: 6
			}
		},
		xaxis: {
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
			tickAmount: 10
		}
	};

	const secondaryChartOptions = {
		chart: {
			id: "secondaryChart",
			type: "area",
			height: 300,
			brush: {
				target: "primaryChart",
				enabled: true
			},
			selection: {
				enabled: true,
				xaxis: {
					min: uptimeFirstEntry,
					max: uptimeLastEntry
				}
			}
		},
		colors: ["#546E7A"],
		xaxis: {
			categories: uptimeCreatedAt,
			labels: {
				show: true,
				rotate: -90,
				offsetX: 10,
				minWidth: 250,
				maxHeight: 250
			}
		},
		fill: {
			type: "solid",
			colors: ["#22c55e"]
		},
		yaxis: {
			tickAmount: 5
		},
		stroke: {
			show: false
		}
	};

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? responseTimeText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div className="mx-auto flex justify-center px-5">
				<div className="mt-4 mb-8 flow-root w-full">
					<Chart options={primaryChartOptions} series={chartSeries} type="line" height={500} />
					<Chart options={secondaryChartOptions} series={chartSeries} type="area" height={300} />
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `ResponseTimeStats` component
 */
export const MemoizedResponseTimeStats = memo(ResponseTimeStats);
