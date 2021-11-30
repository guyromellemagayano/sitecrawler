// External
import "twin.macro";
import { ExclamationIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";

const SiteWarningStatus = ({ text }) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800">
			<ExclamationIcon tw="w-6 h-6 mr-2" />
			{text}
		</span>
	);
};

SiteWarningStatus.propTypes = {
	text: PropTypes.string
};

SiteWarningStatus.defaultProps = {
	text: null
};

export default SiteWarningStatus;
