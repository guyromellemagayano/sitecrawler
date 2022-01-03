// External
import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import "twin.macro";

const SiteInProgressStatus = ({ text }) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-gray-400">
			<DotsCircleHorizontalIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
};

SiteInProgressStatus.propTypes = {
	text: PropTypes.string.isRequired
};

SiteInProgressStatus.defaultProps = {
	text: null
};

export default SiteInProgressStatus;
