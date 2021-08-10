// React
import * as React from "react";

// External
import tw from "twin.macro";
import PropTypes from "prop-types";

const Badge = ({ isDanger, isSuccess, isWarning, text }) => {
	return (
		<span
			css={[
				tw`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`,
				isDanger
					? tw`bg-red-100 text-red-800`
					: isSuccess
					? tw`bg-green-100 text-green-800`
					: isWarning
					? tw`bg-yellow-100 text-yellow-800`
					: tw`bg-blue-100 text-blue-800`
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

Badge.defaultProps = {
	isDanger: false,
	isSuccess: false,
	isWarning: false,
	text: ""
};

export default Badge;
