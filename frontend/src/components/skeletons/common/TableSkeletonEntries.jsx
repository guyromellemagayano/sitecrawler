// React
import * as React from "react";

// External
import "twin.macro";
import PropTypes from "prop-types";

const TableSkeletonEntries = ({ str, limit }) => {
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
};

TableSkeletonEntries.propTypes = {
	str: PropTypes.object,
	limit: PropTypes.number
};

TableSkeletonEntries.defaultProps = {
	str: null,
	limit: null
};

export default TableSkeletonEntries;
