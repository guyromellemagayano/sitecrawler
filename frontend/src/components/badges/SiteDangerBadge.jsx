// External
import "twin.macro";

const SiteDangerBadge = (props) => {
	return (
		<span tw="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{props.text}</span>
	);
};

export default SiteDangerBadge;
