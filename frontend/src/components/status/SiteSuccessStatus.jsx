// External
import "twin.macro";
import { CheckCircleIcon } from "@heroicons/react/outline";

const SiteSuccessStatus = (props) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-green-800">
			<CheckCircleIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</span>
	);
};

export default SiteSuccessStatus;
