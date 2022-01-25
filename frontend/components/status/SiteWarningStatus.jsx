import { ExclamationIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteWarningStatus` component
 *
 * @param {string} text
 */
const SiteWarningStatus = ({ text = null }) => {
	return text !== null ? (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800">
			<ExclamationIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	) : null;
};

SiteWarningStatus.propTypes = {
	text: PropTypes.string
};

/**
 * Memoized custom `SiteWarningStatus` component
 */
export const MemoizedSiteWarningStatus = memo(SiteWarningStatus);
