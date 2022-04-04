/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedUptimeResponseTimeStatsSkeleton } from "@components/skeletons/UptimeResponseTimeStats";
import { RevalidationInterval } from "@constants/GlobalValues";
import { useUptime } from "@hooks/useUptime";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import dynamic from "next/dynamic";
import { memo, useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useSWRConfig } from "swr";

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
	const minuteText = t("sites:minute");
	const hourText = t("sites:hour");
	const dayText = t("sites:day");
	const httpStatusText = t("sites:httpStatus");

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady, querySiteId, user, customUptimeApiEndpoint } = useContext(SiteCrawlerAppContext);

	let queryString = "?created_at__gte=&created_at__lte=&time_step=day";

	// Custom states
	const [updatedUptimeApiEndpoint, setUpdatedUptimeApiEndpoint] = useState(null);

	useEffect(() => {
		customUptimeApiEndpoint
			? setUpdatedUptimeApiEndpoint(customUptimeApiEndpoint + queryString)
			: setUpdatedUptimeApiEndpoint(null);
	}, [customUptimeApiEndpoint]);

	// Custom hooks
	const { uptime, errorUptime, validatingUptime } = useUptime(updatedUptimeApiEndpoint, {
		refreshInterval: RevalidationInterval
	});

	// DayJS options
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
	const responseTimeDataArray = new Array();
	const httpStatusDataArray = new Array();
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const uptimeData = uptime?.data ?? null;
	const uptimeDataLength = uptimeData?.length ?? null;
	const uptimeFirstEntry = uptimeData?.[0]?.created_at ?? null;
	const uptimeLastEntry = uptimeData?.[uptimeDataLength - 1]?.created_at ?? null;
	const initialUptimeTickAmount = 10;

	Array.isArray(uptimeData) &&
		uptimeDataLength > 0 &&
		uptimeData?.map((item) => {
			const createdAt = item?.created_at ?? null;
			const status = item?.status ?? null;
			const httpStatus = item?.http_status ?? null;
			const responseTime = item?.response_time ?? null;
			const error = item?.error ?? null;

			responseTimeDataArray.push([createdAt, responseTime]);
			httpStatusDataArray.push([createdAt, httpStatus]);

			return { responseTimeDataArray };
		});

	const responseTimeChartSeries = [
		{
			name: responseTimeText,
			data: responseTimeDataArray
		}
	];

	const responseTimeChartOptions = {
		chart: {
			id: "primaryChart",
			type: "area",
			height: 320,
			zoom: {
				autoScaleYaxis: true
			}
		},
		stroke: {
			curve: "smooth",
			colors: ["#22c55e"],
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
			title: {
				text: createdAtText
			},
			type: "datetime",
			categories: responseTimeDataArray?.map((item) => item[0]) ?? [],
			min: new Date(uptimeFirstEntry).getTime(),
			max: uptimeLastEntry,
			labels: {
				show: true,
				rotate: 0,
				offsetX: 20,
				dateTimeUTC: disableLocalTime ? true : false,
				format: "MMM dd, yyyy - hh:mm:ss"
			},
			tickAmount: 4
		},
		fill: {
			type: "solid",
			colors: ["#22c55e"]
		},
		yaxis: {
			title: {
				text: responseTimeText
			},
			tickAmount: 10,
			labels: {
				show: true
			}
		},
		tooltip: {
			custom: function ({ seriesIndex, dataPointIndex, w }) {
				return (
					'<div class="response-time-tooltip">' +
					'<div class="response-time-tooltip-title">' +
					'<span class="response-time-tooltip-title-left">' +
					createdAtText +
					': </span><span class="response-time-tooltip-title-left-value">' +
					dayjs(w.config.series[seriesIndex].data[dataPointIndex][0]).calendar(null, calendarStrings) +
					"</span></div>" +
					'<div class="response-time-tooltip-text">' +
					'<span class="response-time-tooltip-title-left">' +
					responseTimeText +
					': </span><span class="response-time-tooltip-title-left-value">' +
					w.config.series[seriesIndex].data[dataPointIndex][1] +
					"</span></div>" +
					"</div>" +
					"</div>"
				);
			}
		}
	};

	const httpStatusChartSeries = [
		{
			name: httpStatusText,
			data: httpStatusDataArray
		}
	];

	const httpStatusChartOptions = {
		chart: {
			id: "primaryChart",
			type: "line",
			height: 320,
			zoom: {
				autoScaleYaxis: true
			}
		},
		stroke: {
			curve: "smooth",
			colors: ["#3b82f6"],
			width: 5
		},
		dataLabels: {
			enabled: false
		},
		markers: {
			size: 5,
			colors: "#1d4ed8",
			hover: {
				size: 6
			}
		},
		xaxis: {
			title: {
				text: createdAtText
			},
			type: "datetime",
			categories: responseTimeDataArray?.map((item) => item[0]) ?? [],
			min: new Date(uptimeFirstEntry).getTime(),
			max: uptimeLastEntry,
			labels: {
				show: true,
				rotate: 0,
				offsetX: 20,
				dateTimeUTC: disableLocalTime ? true : false,
				format: "MMM dd, yyyy - hh:mm:ss"
			},
			tickAmount: 4
		},
		fill: {
			type: "solid",
			colors: ["#3b82f6"]
		},
		yaxis: {
			title: {
				text: httpStatusText
			},
			tickAmount: 10,
			labels: {
				show: true
			}
		},
		tooltip: {
			custom: function ({ seriesIndex, dataPointIndex, w }) {
				return (
					'<div class="response-time-tooltip">' +
					'<div class="response-time-tooltip-title">' +
					'<span class="response-time-tooltip-title-left">' +
					createdAtText +
					': </span><span class="response-time-tooltip-title-left-value">' +
					dayjs(w.config.series[seriesIndex].data[dataPointIndex][0]).calendar(null, calendarStrings) +
					"</span></div>" +
					'<div class="response-time-tooltip-text">' +
					'<span class="response-time-tooltip-title-left">' +
					httpStatusText +
					': </span><span class="response-time-tooltip-title-left-value">' +
					w.config.series[seriesIndex].data[dataPointIndex][1] +
					"</span></div>" +
					"</div>" +
					"</div>"
				);
			}
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
					<Chart options={responseTimeChartOptions} series={responseTimeChartSeries} type="area" height={320} />
				</div>
			</div>

			<div className="flex justify-between border-t py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? httpStatusText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div className="mx-auto flex justify-center px-5">
				<div className="mt-4 mb-8 flow-root w-full">
					<Chart options={httpStatusChartOptions} series={httpStatusChartSeries} type="area" height={320} />
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `ResponseTimeStats` component
 */
export const MemoizedResponseTimeStats = memo(ResponseTimeStats);
