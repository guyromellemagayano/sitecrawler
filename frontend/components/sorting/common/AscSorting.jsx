import { ChevronUpIcon } from "@heroicons/react/solid";
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
	}, [isAscClicked]);

	return (
		<button ref={ref} tw="focus:outline-none" onClick={() => setIsAscClicked(!isAscClicked)}>
			<ChevronUpIcon css={[tw`w-5 h-5 inline-block`, isAscClicked ? tw`text-gray-500` : tw`text-gray-300`]} />
		</button>
	);
};

/**
 * Memoized custom `AscSorting` component
 */
const ForwardRefAscSorting = forwardRef(AscSorting);
export const MemoizedAscSorting = memo(ForwardRefAscSorting);
