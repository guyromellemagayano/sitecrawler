import { ChevronDownIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import { forwardRef, memo, useEffect } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `DescSorting` component
 *
 * @param {function} handleClickEvent
 * @param {boolean} isDescClicked
 * @param {function} setIsDescClicked
 */
const DescSorting = ({ handleClickEvent, isDescClicked, setIsDescClicked }, ref) => {
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
};

DescSorting.propTypes = {
	handleClickEvent: PropTypes.func,
	isDescClicked: PropTypes.bool,
	setIsDescClicked: PropTypes.func
};

/**
 * Memoized custom `DescSorting` component
 */
export const ForwardRefDescSorting = forwardRef(DescSorting);
export const MemoizedDescSorting = memo(ForwardRefDescSorting);
