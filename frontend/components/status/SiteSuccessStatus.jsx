import { CheckCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteSuccessStatus` component
 *
 * @param {string} text
 */
const SiteSuccessStatus = ({ text = null }) => {
	return text !== null ? (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-green-800">
			<CheckCircleIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	) : null;
};

SiteSuccessStatus.propTypes = {
	text: PropTypes.string
};

/**
 * Memoized custom `SiteSuccessStatus` component
 */
export const MemoizedSiteSuccessStatus = memo(SiteSuccessStatus);
