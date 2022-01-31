import { XCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteDangerStatus` component
 *
 * @param {string} text
 */
const SiteDangerStatus = ({ text = null }) => {
	return text !== null ? (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-red-800">
			<XCircleIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	) : null;
};

SiteDangerStatus.propTypes = {
	text: PropTypes.string
};

/**
 * Memoized custom `SiteDangerStatus` component
 */
export const MemoizedSiteDangerStatus = memo(SiteDangerStatus);
