// External
import "twin.macro";

const TableSkeletonEntries = ({ str, limit }) => {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => {
			return (
				<tr tw="w-full" key={key}>
					{value}
				</tr>
			);
		});
	} else return;
};

export default TableSkeletonEntries;
