// React
import * as React from "react";

// External
import "twin.macro";
import { SwitchVerticalIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import CurrentStatusStatsLabel from "./labels/CurrentStatusStats.json";

const SitesCurrentStatusStats = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);

	React.useEffect(() => {
		props.uptimeSummary
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [props.uptimeSummary]);

	return (
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
		</div>
	);
};

SitesCurrentStatusStats.propTypes = {};

export default SitesCurrentStatusStats;
