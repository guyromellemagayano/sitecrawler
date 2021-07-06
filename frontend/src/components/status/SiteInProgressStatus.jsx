// External
import "twin.macro";
import { DotsCircleHorizontalIcon } from "@heroicons/react/outline";

const SiteInProgressStatus = (props) => {
	return (
		<span tw="inline-flex items-center text-sm leading-5 font-semibold rounded-full text-gray-400">
			<DotsCircleHorizontalIcon tw="w-6 h-6 mr-2" />
			{props.text}
		</span>
	);
};

export default SiteInProgressStatus;
