// External
import "twin.macro";
import { ExclamationIcon } from "@heroicons/react/outline";

const SiteWarningStatus = (props) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800">
			<ExclamationIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</span>
	);
};

export default SiteWarningStatus;
