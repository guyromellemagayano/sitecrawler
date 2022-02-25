import { XCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SiteDangerStatus` component
 *
 * @param {string} text
 */
const SiteDangerStatus = ({ text = null }) => {
	return text !== null ? (
		<span className="inline-flex items-center rounded-full text-sm font-semibold leading-5 text-red-800">
			<XCircleIcon className="mr-2 h-6 w-6" />
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
