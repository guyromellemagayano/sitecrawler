import { ChevronUpIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import { forwardRef, memo, useEffect } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `AscSorting` component
 *
 * @param {function} handleClickEvent
 * @param {boolean} isAscClicked
 * @param {function} setIsAscClicked
 */
const AscSorting = ({ handleClickEvent, isAscClicked, setIsAscClicked }, ref) => {
	useEffect(() => {
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
};

AscSorting.propTypes = {
	handleClickEvent: PropTypes.func,
	isAscClicked: PropTypes.bool,
	setIsAscClicked: PropTypes.func
};

/**
 * Memoized custom `AscSorting` component
 */
export const ForwardRefAscSorting = forwardRef(AscSorting);
export const MemoizedAscSorting = memo(ForwardRefAscSorting);
