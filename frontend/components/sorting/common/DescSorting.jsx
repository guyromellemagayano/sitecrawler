// React
import { forwardRef, useEffect } from "react";

// External
import tw from "twin.macro";
import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/solid";

const DescSorting = forwardRef(({ handleClickEvent, isDescClicked, setIsDescClicked }, ref) => {
	useEffect(() => {
		document.addEventListener("click", handleClickEvent, true);

		return () => {
			document.removeEventListener("click", handleClickEvent, true);
		};
	});

	return (
		<button ref={ref} tw="focus:outline-none" onClick={() => setIsDescClicked(!isDescClicked)}>
			<ChevronDownIcon css={[tw`w-5 h-5 inline-block`, isDescClicked ? tw`text-gray-500` : tw`text-gray-300`]} />
		</button>
	);
});

DescSorting.propTypes = {};

export default DescSorting;
