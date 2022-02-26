import PropTypes from "prop-types";
import { memo } from "react";

/**
 * Custom function to render the `SkeletonEntries` component
 */
const SkeletonEntries = ({ str = null, limit = null }) => {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => (
			<div className="w-full" key={key}>
				{value}
			</div>
		));
	} else return;
};

SkeletonEntries.propTypes = {
	limit: PropTypes.number,
	str: PropTypes.object
};

/**
 * Memoized custom `SkeletonEntries` component
 */
export const MemoizedSkeletonEntries = memo(SkeletonEntries);
