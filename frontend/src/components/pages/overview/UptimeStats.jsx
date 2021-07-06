// React
import * as React from "react";

// External
import "twin.macro";
import { ArrowCircleUpIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import UptimeStatsLabel from "./labels/UptimeStats.json";

const SitesUptimeStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

	React.useEffect(() => {
		props.uptimeSummary
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.uptimeSummary]);

	const uptimePercentage = Object.entries(props.uptimeSummary.uptime_percentage);

	return (
		<div tw="overflow-hidden rounded-lg h-full border">
			<div tw="flex justify-between py-8 px-5">
				<div tw="flex items-center">
					{componentReady ? (
						<ArrowCircleUpIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? UptimeStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
			<div tw="flex justify-center mx-auto px-5">
				<div tw="w-full flow-root mt-4 mb-8">
					<ul tw="-my-5 divide-y divide-gray-200">
						{uptimePercentage.map((value, index) => (
							<li key={index} tw="py-4">
								<div tw="flex items-center justify-between">
									<div tw="flex-1 flex items-start space-x-4">
										<dl tw="relative -top-1">
											{value[0] !== null && value[1] !== null ? (
												<dt tw="inline-flex w-2 h-2 bg-green-400 rounded-full" aria-label="uptime-percentage" />
											) : (
												<Skeleton duration={2} width={10} height={10} circle={true} tw="relative top-1.5" />
											)}
										</dl>

										<dl>
											<dt tw="min-w-0">
												{value[0] !== null && value[1] !== null ? (
													<>
														<p tw="text-sm font-bold text-green-900">
															{value[1] !== null ? value[1].toFixed(3) + "%" : null}
														</p>
														<p tw="text-sm text-gray-500 truncate">
															{value[0] !== null
																? value[0] == "24h"
																	? "last 24 hours"
																	: value[0] == "7d"
																	? "last 7 days"
																	: value[0] == "30d"
																	? "last 30 days"
																	: null
																: null}
														</p>
													</>
												) : (
													<div tw="flex flex-col">
														<Skeleton duration={2} width={80} height={20} />
														<Skeleton duration={2} width={85} height={20} />
													</div>
												)}
											</dt>
										</dl>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

SitesUptimeStats.propTypes = {};

export default SitesUptimeStats;
