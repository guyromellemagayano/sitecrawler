import PropTypes from "prop-types";
import { memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `TableSkeletonEntries` component
 */
export function TableSkeletonEntries({ str = null, limit = null }) {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => (
			<tr tw="w-full" key={key}>
				{value}
			</tr>
		));
	} else return;
}

TableSkeletonEntries.propTypes = {
	limit: PropTypes.number.isRequired,
	str: PropTypes.object
};

/**
 * Memoized custom `TableSkeletonEntries` component
 */
export const MemoizedTableSkeletonEntries = memo(TableSkeletonEntries);
