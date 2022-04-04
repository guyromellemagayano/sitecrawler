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

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom context
	const { isComponentReady, querySiteId, user, customUptimeApiEndpoint } = useContext(SiteCrawlerAppContext);

	let queryString = "";

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
	const uptimeDataArray = new Array();
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

			uptimeDataArray.push([createdAt, responseTime]);

			return { uptimeDataArray };
		});

	const chartSeries = [
		{
			name: responseTimeText,
			data: uptimeDataArray
		}
	];

	const chartOptions = {
		chart: {
			id: "primaryChart",
			type: "area",
			height: 640,
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
			categories: uptimeDataArray?.map((item) => item[0]) ?? [],
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
			tickAmount: 20,
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

	const handleUpdateTimeStep = (e, val) => {
		queryString = "";

		if (e.target && val) {
			switch (val) {
				case "one_minute":
					queryString += `?created_at__gte=&created_at__lte=&time_step=minute`;
					break;
				case "one_hour":
					queryString += `?created_at__gte=&created_at__lte=&time_step=hour`;
					break;
				case "one_day":
					queryString += `?created_at__gte=&created_at__lte=&time_step=day`;
					break;
				default:
					break;
			}
		}

		setUpdatedUptimeApiEndpoint(`${customUptimeApiEndpoint + queryString}`);

		// Mutate "uptime" endpoint after successful 200 OK or 201 Created response is issued
		mutate(updatedUptimeApiEndpoint, null, {
			optimisticData: uptime?.data,
			rollbackOnError: true,
			revalidate: true
		});
	};

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? responseTimeText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>

				{isComponentReady ? (
					<div className="inline-flex space-x-3">
						<button
							onClick={(e) => handleUpdateTimeStep(e, "one_minute")}
							className="text-sm font-medium leading-5 text-gray-500 hover:underline"
						>
							{minuteText}
						</button>
						<span className="text-gray-300" aria-hidden="true">
							|
						</span>
						<button
							onClick={(e) => handleUpdateTimeStep(e, "one_hour")}
							className="text-sm font-medium leading-5 text-gray-500 hover:underline"
						>
							{hourText}
						</button>
						<span className="text-gray-300" aria-hidden="true">
							|
						</span>
						<button
							onClick={(e) => handleUpdateTimeStep(e, "one_day")}
							className="text-sm font-medium leading-5 text-gray-500 hover:underline"
						>
							{dayText}
						</button>
					</div>
				) : (
					<div className="inline-flex space-x-3">
						<Skeleton duration={2} width={75} height={15} />
						<Skeleton duration={2} width={75} height={15} />
						<Skeleton duration={2} width={75} height={15} />
					</div>
				)}
			</div>
			<div className="mx-auto flex justify-center px-5">
				<div className="mt-4 mb-8 flow-root w-full">
					<Chart options={chartOptions} series={chartSeries} type="area" height={640} />
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `ResponseTimeStats` component
 */
export const MemoizedResponseTimeStats = memo(ResponseTimeStats);
