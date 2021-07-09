// React
import * as React from "react";

// External
import "twin.macro";
import { ArrowCircleDownIcon } from "@heroicons/react/outline";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import DowntimeStatsLabel from "./labels/DowntimeStats.json";

const SitesDowntimeStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const calendar = require("dayjs/plugin/calendar");
	const customParseFormat = require("dayjs/plugin/customParseFormat");
	const relativeTime = require("dayjs/plugin/relativeTime");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(customParseFormat);
	dayjs.extend(relativeTime);
	dayjs.extend(timezone);
	dayjs.extend(utc);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	React.useEffect(() => {
		const delay = 500;

		let timer = setTimeout(() => setComponentReady(true), delay);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	const uptimeCurrent = props.uptimeSummary?.current;
	const uptimeLastOk = props.uptimeSummary?.last_ok;
	const uptimeLastDowntime = props.uptimeSummary?.last_downtime;

	return uptimeCurrent !== undefined && uptimeCurrent !== null && Object.keys(uptimeCurrent).length > 0 ? (
		<div tw="flex flex-col overflow-hidden rounded-lg h-full border">
			<div tw="flex justify-between py-8 px-5">
				<div tw="flex items-center">
					{componentReady ? (
						<ArrowCircleDownIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? DowntimeStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div tw="flex h-full justify-between px-5">
				<div tw="w-full flow-root mt-2 mb-8">
					<div>
						<div tw="flex-1 flex items-start space-x-4">
							<dl tw="flex-none relative -top-1">
								{uptimeLastDowntime !== null ? (
									<dt tw="inline-flex w-2 h-2 bg-red-400 rounded-full" aria-label="uptime-status" />
								) : (
									<Skeleton duration={2} width={10} height={10} circle={true} tw="relative top-1.5" />
								)}
							</dl>

							<dl>
								<dt>
									{uptimeCurrent?.status !== null ? (
										<>
											{uptimeLastDowntime !== null ? (
												<p tw="text-sm text-gray-500 whitespace-pre-wrap">
													It was recorded{" "}
													<span tw="font-semibold">
														{!props.disableLocalTime
															? dayjs(uptimeLastDowntime).calendar(null, calendarStrings)
															: dayjs.utc(uptimeLastDowntime).calendar(null, calendarStrings)}
													</span>
													<span tw="ml-1 font-semibold">({!props.disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
												</p>
											) : null}
										</>
									) : (
										<div tw="flex flex-col">
											<Skeleton duration={2} width={80} height={20} />
											<Skeleton duration={2} width={85} height={20} />
											<Skeleton duration={2} width={120} height={20} />
										</div>
									)}
								</dt>
							</dl>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : null;
};

SitesDowntimeStats.propTypes = {};

export default SitesDowntimeStats;
