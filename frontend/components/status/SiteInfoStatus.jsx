import { InformationCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SiteInfoStatus` component
 *
 * @param {string} text
 */
const SiteInfoStatus = ({ text = null }) => {
	return text !== null ? (
		<span className="inline-flex items-center rounded-full text-sm font-semibold leading-5 text-indigo-800">
			<InformationCircleIcon className="mr-2 h-5 w-5" />
			{text}
		</span>
	) : null;
};

SiteInfoStatus.propTypes = {
	text: PropTypes.string
};

/**
 * Memoized custom `SiteInfoStatus` component
 */
export const MemoizedSiteInfoStatus = memo(SiteInfoStatus);
