// React
import "twin.macro";
import PropTypes from "prop-types";

const SkeletonEntries = ({ str, limit }) => {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => (
			<div tw="w-full" key={key}>
				{value}
			</div>
		));
	} else return;
};

SkeletonEntries.propTypes = {
	str: PropTypes.object,
	limit: PropTypes.number
};

SkeletonEntries.defaultProps = {
	str: null,
	limit: null
};

export default SkeletonEntries;
