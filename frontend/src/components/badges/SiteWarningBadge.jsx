// External
import "twin.macro";

const SiteWarningBadge = (props) => {
	return (
		<div tw="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
			{props.text}
		</div>
	);
};

export default SiteWarningBadge;
