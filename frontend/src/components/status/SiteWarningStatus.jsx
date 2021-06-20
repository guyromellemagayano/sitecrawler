// React
import * as React from "react";

// External
import { ExclamationIcon } from "@heroicons/react/outline";
import { styled } from "twin.macro";

const SiteWarningStatusSpan = styled.span``;

const SiteWarningStatus = (props) => {
	return (
		<SiteWarningStatusSpan tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800">
			<ExclamationIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</SiteWarningStatusSpan>
	);
};

export default SiteWarningStatus;
