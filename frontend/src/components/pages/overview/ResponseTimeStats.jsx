// React
import * as React from "react";

// External
import "twin.macro";
import { PresentationChartLineIcon } from "@heroicons/react/solid";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import ResponseTimeStatsLabel from "./labels/ResponseTimeStats.json";

// Components
const Chart = loadable(() => import("react-apexcharts"));

const SitesResponseTimeStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

	React.useEffect(() => {
		props.uptime
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [props.uptime]);

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
						{componentReady ? ResponseTimeStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
			</div>
		</div>
	);
};

SitesResponseTimeStats.propTypes = {};

export default withResizeDetector(SitesResponseTimeStats);
