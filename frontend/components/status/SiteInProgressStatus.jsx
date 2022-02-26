import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SiteInProgressStatus` component
 *
 * @param {string} text
 */
const SiteInProgressStatus = ({ text = null }) => {
	return text !== null ? (
		<span className="inline-flex items-center rounded-full text-sm font-semibold leading-5 text-gray-400">
			<DotsCircleHorizontalIcon className="mr-2 h-6 w-6" />
			{text}
		</span>
	) : null;
};

SiteInProgressStatus.propTypes = {
	text: PropTypes.string
};

/**
 * Memoized custom `SiteInProgressStatus` component
 */
export const MemoizedSiteInProgressStatus = memo(SiteInProgressStatus);
