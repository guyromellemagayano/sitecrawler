import { ExclamationIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

export function SiteWarningStatus({ text = null }) {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800">
			<ExclamationIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
}

SiteWarningStatus.propTypes = {
	text: PropTypes.string.isRequired
};

export const MemoizedSiteWarningStatus = memo(SiteWarningStatus);
