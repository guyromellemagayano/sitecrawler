import { CheckCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SiteSuccessStatus` component
 *
 * @param {string} text
 */
const SiteSuccessStatus = ({ text = null }) => {
	return text !== null ? (
		<span className="inline-flex items-center rounded-full text-sm font-semibold leading-5 text-green-800">
			<CheckCircleIcon className="mr-2 h-5 w-5" />
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
