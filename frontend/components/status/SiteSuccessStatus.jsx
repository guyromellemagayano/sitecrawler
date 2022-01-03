import { CheckCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

export function SiteSuccessStatus({ text = null }) {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-green-800">
			<CheckCircleIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
}

SiteSuccessStatus.propTypes = {
	text: PropTypes.string.isRequired
};

export const MemoizedSiteSuccessStatus = memo(SiteSuccessStatus);
