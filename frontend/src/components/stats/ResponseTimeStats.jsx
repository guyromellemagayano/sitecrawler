// React
import * as React from "react";

// NextJS
import dynamic from "next/dynamic";

// External
import "twin.macro";
import { PresentationChartLineIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import ResponseTimeStatsLabel from "./labels/ResponseTimeStats.json";

// Components
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SitesResponseTimeStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

	React.useEffect(() => {
		const delay = 500;

		let timer = setTimeout(() => setComponentReady(true), delay);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	// console.log([...new Set([].concat(...props.uptime))]);

	// const chartSeries = [{}];

	// const chartOptions = {};

	return (
		<div tw="overflow-hidden rounded-lg h-full border">
			<div tw="flex justify-between py-8 px-5">
				<div tw="flex items-center">
					{componentReady ? (
						<PresentationChartLineIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? (
							ResponseTimeStatsLabel[0].label
						) : (
							<Skeleton duration={2} width={100} height={15} />
						)}
					</h2>
				</div>
			</div>

			<div tw="flex justify-center mx-auto px-5">
				<div tw="w-full flow-root mt-4 mb-8">
					<div id="chart-line">
						{/* <Chart options={chartOptions} series={chartSeries} type="line" height={} /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

SitesResponseTimeStats.propTypes = {};

export default SitesResponseTimeStats;
