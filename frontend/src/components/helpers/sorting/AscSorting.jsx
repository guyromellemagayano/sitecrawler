// React
import * as React from "react";

// External
import tw from "twin.macro";
import PropTypes from "prop-types";
import { ChevronUpIcon } from "@heroicons/react/solid";

const AscSorting = React.forwardRef(({ selectedSort, handleClickEvent, isAscClicked, setIsAscClicked }, ref) => {
	React.useEffect(() => {
		document.addEventListener("click", handleClickEvent, true);

		return () => {
			document.removeEventListener("click", handleClickEvent, true);
		};
	});

	return (
		<button ref={ref} tw="focus:outline-none" onClick={() => setIsAscClicked(!isAscClicked)}>
			<ChevronUpIcon css={[tw`w-5 h-5 inline-block`, isAscClicked ? tw`text-gray-500` : tw`text-gray-300`]} />
		</button>
	);
});

export default AscSorting;
