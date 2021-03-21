// External
import "twin.macro";

const SkeletonEntries = ({ str, limit }) => {
	let strArray = [];

	if (limit > 0) {
		for (let index = 0; index < limit; index++) {
			strArray.push(str);
		}

		return strArray.map((value, key) => {
			return (
				<div tw="w-full" key={key}>
					{value}
				</div>
			);
		});
	} else return;
};

export default SkeletonEntries;
