import { ArrowSmDownIcon, ArrowSmUpIcon, ExclamationIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `CurrentStatusStats` component
 */
const CurrentStatusStats = () => {
	// Translations
	const { t } = useTranslation();
	const currentStatusText = t("sites:currentStatus");
	const lastDowntimeText = t("sites:lastDowntime");
	const lastUptimeText = t("sites:lastUptime");
	const sinceText = t("sites:since");
	const uptimeErrorsText = t("sites:uptimeErrors");

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
	const uptimeCurrentCreatedAtTimestamp = uptimeSummary?.data?.current?.created_at ?? null;
	const uptimeCurrentCreatedAt = !disableLocalTime
		? dayjs(uptimeCurrentCreatedAtTimestamp).calendar(null, calendarStrings)
		: dayjs.utc(uptimeCurrentCreatedAtTimestamp).calendar(null, calendarStrings);
	const uptimeCurrentStatus = uptimeSummary?.data?.current?.status ?? null;
	const uptimeLastDowntimeTimestamp = uptimeSummary?.data?.last_downtime ?? null;
	const uptimeLastDowntime = !disableLocalTime
		? dayjs(uptimeLastDowntimeTimestamp).calendar(null, calendarStrings)
		: dayjs.utc(uptimeLastDowntimeTimestamp).calendar(null, calendarStrings);
	const uptimeLastUptimeTimestamp = uptimeSummary?.data?.last_ok ?? null;
	const uptimeLastUptime = !disableLocalTime
		? dayjs(uptimeLastUptimeTimestamp).calendar(null, calendarStrings)
		: dayjs.utc(uptimeLastUptimeTimestamp).calendar(null, calendarStrings);
	const uptimeErrors = uptimeSummary?.data?.current?.error ?? null;

	return (
		<div className="h-full overflow-hidden rounded-lg border">
			<div className="flex justify-between py-8 px-5">
				<div className="flex items-center">
					<h2 className="text-lg font-bold leading-7 text-gray-900">
						{isComponentReady ? currentStatusText : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div className="mx-auto flex justify-center px-5 pb-8">
				<div className="my-2 flow-root w-full">
					{isComponentReady && uptimeCurrentStatus && (uptimeLastDowntime || uptimeLastUptime) ? (
						<>
							<div className="flex flex-col space-y-4">
								<div className="flex flex-1 flex-col items-start space-x-6">
									<div className="flex items-center space-x-4">
										<span
											className={classnames(
												isComponentReady && uptimeCurrentStatus === "OK" ? "bg-green-400" : "bg-red-400",
												"inline-block h-2 w-2 flex-shrink-0 rounded-full"
											)}
											aria-label="uptime-status"
										/>
										<p
											className={classnames(
												isComponentReady && uptimeCurrentStatus === "OK" ? "text-green-600" : "text-red-600",
												"text-2xl font-bold"
											)}
										>
											{uptimeCurrentStatus}
										</p>
									</div>

									<p className="block truncate font-semibold text-gray-500 sm:text-sm">
										{sinceText +
											" " +
											dayjs
												.duration(dayjs(uptimeLastUptimeTimestamp).diff(dayjs(uptimeLastDowntimeTimestamp)))
												.format("HH [hours], mm [minutes]") +
											" "}
									</p>
								</div>

								<div className="flex flex-1 flex-col items-start space-x-6">
									<div className="flex items-start">
										<ArrowSmUpIcon
											className="relative -left-2 top-1 inline-block h-6 w-6 flex-shrink-0 rounded-full leading-3 text-green-400"
											aria-label="uptime-status"
										/>

										<p className="text-2xl font-bold text-green-600">{uptimeLastUptime}</p>
									</div>

									<p className="block truncate font-semibold text-gray-500 sm:text-sm">{lastUptimeText}</p>
								</div>

								<div className="flex flex-1 flex-col items-start space-x-6">
									<div className="flex items-start">
										<ArrowSmDownIcon
											className="relative -left-2 top-1 inline-block h-6 w-6 flex-shrink-0 rounded-full leading-3 text-red-400"
											aria-label="downtime-status"
										/>

										<p className="text-2xl font-bold text-red-600">{uptimeLastDowntime}</p>
									</div>

									<p className="block truncate font-semibold text-gray-500 sm:text-sm">{lastDowntimeText}</p>
								</div>

								{uptimeErrors && uptimeErrors?.length > 0 ? (
									<div className="flex flex-1 flex-col items-start space-x-6">
										<div className="flex items-start">
											<ExclamationIcon
												className="relative -left-2 top-1 inline-block h-6 w-6 flex-shrink-0 rounded-full leading-3 text-red-400"
												aria-label="downtime-errors"
											/>

											<p className="text-2xl font-bold text-red-600">{uptimeErrors}</p>
										</div>

										<p className="block truncate font-semibold text-gray-500 sm:text-sm">{uptimeErrorsText}</p>
									</div>
								) : null}
							</div>
						</>
					) : (
						<div className="flex flex-col space-y-4">
							<div className="flex flex-1 flex-col items-start space-x-6">
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
							</div>

							<div className="flex flex-1 flex-col items-start space-x-6">
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
							</div>

							<div className="flex flex-1 flex-col items-start space-x-6">
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
							</div>

							<div className="flex flex-1 flex-col items-start space-x-6">
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
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/**
 * Memoized custom `CurrentStatusStats` component
 */
export const MemoizedCurrentStatusStats = memo(CurrentStatusStats);
