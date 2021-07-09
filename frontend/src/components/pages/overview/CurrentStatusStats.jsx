// React
import * as React from "react";

// External
import "twin.macro";
import { SwitchVerticalIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import CurrentStatusStatsLabel from "./labels/CurrentStatusStats.json";

const SitesCurrentStatusStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

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
		<div tw="overflow-hidden rounded-lg h-full border">
			<div tw="flex justify-between py-8 px-5">
				<div tw="flex items-center">
					{componentReady ? (
						<SwitchVerticalIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? CurrentStatusStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div tw="flex justify-center mx-auto px-5">
				<div tw="w-full flow-root mt-4 mb-8">
					<ul tw="-my-5 divide-y divide-gray-200">
						<li tw="py-4">
							<div tw="flex items-center justify-between">
								<div tw="flex-1 flex items-start space-x-4">
									<dl tw="relative top-1">
										{uptimeCurrent?.status !== null ? (
											uptimeCurrent?.status == "OK" ? (
												<dt tw="inline-flex w-2 h-2 bg-green-400 rounded-full" aria-label="uptime-status" />
											) : (
												<dt tw="inline-flex w-2 h-2 bg-red-400 rounded-full" aria-label="uptime-status" />
											)
										) : (
											<Skeleton duration={2} width={10} height={10} circle={true} tw="relative top-1.5" />
										)}
									</dl>

									<dl>
										<dt tw="min-w-0">
											{uptimeCurrent?.status !== null ? (
												<>
													{uptimeCurrent?.status == "OK" ? (
														<>
															<p tw="text-2xl font-bold text-green-600">{uptimeCurrent?.status}</p>
															<p tw="block sm:text-sm font-semibold text-gray-500 truncate">
																Since{" "}
																{dayjs
																	.duration(dayjs(uptimeLastOk).diff(dayjs(uptimeLastDowntime)))
																	.format("HH [hours], mm [minutes]")}{" "}
															</p>
														</>
													) : (
														<>
															<p tw="text-2xl font-bold text-red-600">{uptimeCurrent?.status}</p>
															<p tw="text-sm font-semibold text-gray-500 truncate">
																Since{" "}
																{dayjs(
																	dayjs.duration(dayjs(uptimeLastOk).diff(dayjs(uptimeLastDowntime))).asHours()
																).format("H [hours], mm [mins] [ago]")}{" "}
															</p>
														</>
													)}
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
						</li>
					</ul>
				</div>
			</div>
		</div>
	) : null;
};

SitesCurrentStatusStats.propTypes = {};

export default SitesCurrentStatusStats;
