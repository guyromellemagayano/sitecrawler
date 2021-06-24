// External
import "twin.macro";

const SiteSuccessBadge = (props) => {
	return (
		<span tw="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
			{props.text}
		</span>
	);
};

export default SiteSuccessBadge;
