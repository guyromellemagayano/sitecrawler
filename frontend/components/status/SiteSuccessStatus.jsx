// External
import "twin.macro";
import { CheckCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";

const SiteSuccessStatus = ({ text }) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-green-800">
			<CheckCircleIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
};

SiteSuccessStatus.propTypes = {
	text: PropTypes.string
};

SiteSuccessStatus.defaultProps = {
	text: null
};

export default SiteSuccessStatus;
