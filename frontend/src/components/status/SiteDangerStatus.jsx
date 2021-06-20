// React
import * as React from "react";

// External
import { XCircleIcon } from "@heroicons/react/outline";
import { styled } from "twin.macro";

const SiteDangerStatusSpan = styled.span``;

const SiteDangerStatus = (props) => {
	return (
		<SiteDangerStatusSpan tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-red-800">
			<XCircleIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</SiteDangerStatusSpan>
	);
};

export default SiteDangerStatus;
