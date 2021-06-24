// External
import "twin.macro";
import { XCircleIcon } from "@heroicons/react/outline";

const SiteDangerStatus = (props) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-red-800">
			<XCircleIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</span>
	);
};

export default SiteDangerStatus;
