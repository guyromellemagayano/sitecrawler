import { ArrowSmUpIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `UptimeStats` component
 */
const UptimeStats = () => {
	// Translations
	const { t } = useTranslation();
	const uptimeText = t("sites:uptime");
	const last24HoursText = t("sites:last24Hours");
	const last7DaysText = t("sites:last7Days");
	const last30DaysText = t("sites:last30Days");

	// Custom context
	const { isComponentReady, querySiteId, uptimeSummary, user } = useContext(SiteCrawlerAppContext);

	const calendar = require("dayjs/plugin/calendar");
	const customParseFormat = require("dayjs/plugin/customParseFormat");
	const duration = require("dayjs/plugin/duration");
	const relativeTime = require("dayjs/plugin/relativeTime");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(customParseFormat);
	dayjs.extend(duration);
	dayjs.extend(relativeTime);
	dayjs.extend(timezone);
	dayjs.extend(utc);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const uptimeCurrentStatus = uptimeSummary?.data?.current?.status ?? null;
	const uptimePercentage = uptimeSummary?.data?.uptime_percentage ?? null;

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? uptimeText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div className="mx-auto flex justify-center px-5 pb-8">
				<div className="my-2 flow-root w-full">
					{isComponentReady && uptimePercentage ? (
						<div className="flex flex-col space-y-4">
							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center">
									<ArrowSmUpIcon
										className={classnames(
											isComponentReady && uptimeCurrentStatus === "OK" ? "text-green-400" : "text-red-400",
											"relative -left-2 inline-block h-6 w-6 flex-shrink-0 rounded-full"
										)}
										aria-label="uptime-status"
									/>

									<p className="text-2xl font-bold text-green-600">
										{uptimePercentage?.[Object.keys(uptimePercentage)?.[0]]?.toFixed(2) + "%"}
									</p>
								</div>

								<p className="block truncate font-semibold text-gray-500 sm:text-sm">{last24HoursText}</p>
							</span>

							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center">
									<ArrowSmUpIcon
										className={classnames(
											isComponentReady && uptimeCurrentStatus === "OK" ? "text-green-400" : "text-red-400",
											"relative -left-2 inline-block h-6 w-6 flex-shrink-0 rounded-full"
										)}
										aria-label="uptime-status"
									/>

									<p className="text-2xl font-bold text-green-600">
										{uptimePercentage?.[Object.keys(uptimePercentage)?.[1]]?.toFixed(2) + "%"}
									</p>
								</div>

								<p className="block truncate font-semibold text-gray-500 sm:text-sm">{last7DaysText}</p>
							</span>

							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center">
									<ArrowSmUpIcon
										className={classnames(
											isComponentReady && uptimeCurrentStatus === "OK" ? "text-green-400" : "text-red-400",
											"relative -left-2 inline-block h-6 w-6 flex-shrink-0 rounded-full"
										)}
										aria-label="uptime-status"
									/>

									<p className="text-2xl font-bold text-green-600">
										{uptimePercentage?.[Object.keys(uptimePercentage)?.[2]]?.toFixed(2) + "%"}
									</p>
								</div>

								<p className="block truncate font-semibold text-gray-500 sm:text-sm">{last30DaysText}</p>
							</span>
						</div>
					) : (
						<div className="flex flex-col space-y-4">
							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center space-x-4">
									<Skeleton
										duration={2}
										width={8}
										height={8}
										circle={true}
										className="inline-block h-2 w-2 flex-shrink-0"
									/>

									<Skeleton duration={2} width={85} height={32} className="leading-8" />
								</div>

								<Skeleton duration={2} width={120} height={20} classname="block" />
							</span>

							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center space-x-4">
									<Skeleton
										duration={2}
										width={8}
										height={8}
										circle={true}
										className="inline-block h-2 w-2 flex-shrink-0"
									/>

									<Skeleton duration={2} width={85} height={32} className="leading-8" />
								</div>

								<Skeleton duration={2} width={120} height={20} classname="block" />
							</span>

							<span className="flex flex-1 flex-col items-start space-x-6">
								<div className="flex items-center space-x-4">
									<Skeleton
										duration={2}
										width={8}
										height={8}
										circle={true}
										className="inline-block h-2 w-2 flex-shrink-0"
									/>

									<Skeleton duration={2} width={85} height={32} className="leading-8" />
								</div>

								<Skeleton duration={2} width={120} height={20} classname="block" />
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `UptimeStats` component
 */
export const MemoizedUptimeStats = memo(UptimeStats);
