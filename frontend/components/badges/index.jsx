import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `Badge` component
 *
 * @param {boolean} isDanger
 * @param {boolean} isSuccess
 * @param {boolean} isWarning
 * @param {string} text
 */
const Badge = ({ isDanger = false, isSuccess = false, isWarning = false, text = null }) => {
	return (
		<span
			css={[
				"px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
				isDanger
					? "bg-red-100 text-red-800"
					: isSuccess
					? "bg-green-100 text-green-800"
					: isWarning
					? "bg-yellow-100 text-yellow-800"
					: "bg-blue-100 text-blue-800"
			]}
		>
			{text}
		</span>
	);
};

Badge.propTypes = {
	isDanger: PropTypes.bool,
	isSuccess: PropTypes.bool,
	isWarning: PropTypes.bool,
	text: PropTypes.string
};

/**
 * Memoized custom `Badge` component
 */
export const MemoizedBadge = memo(Badge);
