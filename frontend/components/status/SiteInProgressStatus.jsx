import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteInProgressStatus` component
 *
 * @param {string} text
 */
const SiteInProgressStatus = ({ text = null }) => {
	return text !== null ? (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-gray-400">
			<DotsCircleHorizontalIcon tw="w-6 h-6 mr-2" />
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
