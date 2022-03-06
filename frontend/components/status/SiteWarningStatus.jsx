import { ExclamationIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SiteWarningStatus` component
 *
 * @param {string} text
 */
const SiteWarningStatus = ({ text = null }) => {
	return text !== null ? (
		<span className="inline-flex items-center rounded-full text-sm font-semibold leading-5 text-yellow-800">
			<ExclamationIcon className="mr-2 h-5 w-5" />
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
