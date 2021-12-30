import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SkeletonEntries` component
 */
export function SkeletonEntries({ str = null, limit = null }) {
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
}

SkeletonEntries.propTypes = {
	limit: PropTypes.number.isRequired,
	str: PropTypes.object
};

/**
 * Memoized custom `SkeletonEntries` component
 */
export const MemoizedSkeletonEntries = memo(SkeletonEntries);
