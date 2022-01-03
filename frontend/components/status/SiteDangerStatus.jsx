// External
import { XCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import "twin.macro";

const SiteDangerStatus = ({ text }) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-red-800">
			<XCircleIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
};

SiteDangerStatus.propTypes = {
	text: PropTypes.string.isRequired
};

SiteDangerStatus.defaultProps = {
	text: null
};

export default SiteDangerStatus;
