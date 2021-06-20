// React
import * as React from "react";

// External
import { CheckCircleIcon } from "@heroicons/react/solid";
import { styled } from "twin.macro";

const SiteSuccessStatusSpan = styled.span``;

const SiteSuccessStatus = (props) => {
	return (
		<SiteSuccessStatusSpan tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-green-800">
			<CheckCircleIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</SiteSuccessStatusSpan>
	);
};

export default SiteSuccessStatus;
